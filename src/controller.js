import { pool } from './config/db.js'

export const createUser = async (req, res) => {
  try {
    const { nombre, email, contraseña, usuario, roleId } = req.body

    if (!nombre || !email || !contraseña || !usuario || !roleId) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    await pool.execute('INSERT INTO usuarios (nombre, email, contraseña, usuario, role_Id) VALUES (?, ?, ?, ?, ?)', [nombre, email, contraseña, usuario, roleId])

    res.status(201).json({ message: 'Usuario creado exitosamente', user: { nombre, email, usuario, roleId } })
  } catch (err) {
    console.error('Error al crear el usuario:', err)

    return res.status(500).json({ message: 'Error al crear el usuario' })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, email, contraseña, usuario, roleId, userId } = req.body

    if (!id) {
      return res.status(400).json({ message: 'ID de usuario no proporcionado' })
    }

    if (id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este usuario' })
    }

    if (!nombre && !email && !contraseña && !usuario && !roleId) {
      return res.status(400).json({ message: 'Debe proporcionar al menos uno de los campos para actualizar' })
    }

    const [currentUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])

    if (!currentUser.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (email && email !== currentUser[0].email) {
      const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email])
      if (existingUser.length) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' })
      }
    }

    let updateQuery = 'UPDATE usuarios SET '
    const updateValues = []

    if (nombre) {
      updateQuery += 'nombre = ?, '
      updateValues.push(nombre)
    }
    if (email) {
      updateQuery += 'email = ?, '
      updateValues.push(email)
    }
    if (contraseña) {
      updateQuery += 'contraseña = ?, '
      updateValues.push(contraseña)
    }
    if (usuario) {
      updateQuery += 'usuario = ?, '
      updateValues.push(usuario)
    }
    if (roleId) {
      updateQuery += 'role_Id = ?, '
      updateValues.push(roleId)
    }

    updateQuery = updateQuery.slice(0, -2)

    updateQuery += ' WHERE id = ?'
    updateValues.push(id)

    await pool.execute(updateQuery, updateValues)

    const [updatedUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])

    if (!updatedUser.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json({ message: 'Usuario actualizado exitosamente', user: updatedUser[0] })
  } catch (err) {
    console.error('Error al actualizar usuario:', err)

    return res.status(500).json({ message: 'Error al actualizar el usuario' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    if (!id) {
      return res.status(400).json({ message: 'ID de usuario no proporcionado' })
    }

    if (id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este usuario' })
    }

    const [currentUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])

    if (!currentUser.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    await pool.execute('DELETE FROM usuarios WHERE id = ?', [id])

    res.status(200).json({ message: 'Usuario eliminado exitosamente' })
  } catch (err) {
    console.error('Error al eliminar usuario:', err)

    return res.status(500).json({ message: 'Error al eliminar el usuario' })
  }
}

export const getUsers = async (req, res) => {
  try {
    const { roleId } = req.body

    if (roleId !== 1) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta función' })
    }

    const [users] = await pool.query('SELECT * FROM usuarios WHERE role_Id = ?', [2])

    res.status(200).json({ users })
  } catch (err) {
    console.error('Error al obtener usuarios:', err)

    return res.status(500).json({ message: 'Error al obtener usuarios' })
  }
}

export const createPost = async (req, res) => {
  try {
    const { contenido, titulo, usuarioId, categorias } = req.body

    if (!contenido || !titulo || !usuarioId || !categorias || categorias.length === 0) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios, incluyendo al menos una categoría' })
    }

    const [usuario] = await pool.query('SELECT nombre FROM usuarios WHERE id = ?', [usuarioId])

    if (!usuario.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const nombreUsuario = usuario[0].nombre

    const [result] = await pool.execute(
      'INSERT INTO publicaciones (contenido, titulo, usuario_id, nombre_usuario) VALUES (?, ?, ?, ?)',
      [contenido, titulo, usuarioId, nombreUsuario]
    )
    const nuevaPublicacionId = result.insertId

    for (const categoriaNombre of categorias) {
      const [existingCategoria] = await pool.query('SELECT id FROM categorias WHERE nombre = ?', [categoriaNombre])

      if (existingCategoria.length) {
        const categoriaId = existingCategoria[0].id
        await pool.execute(
          'INSERT INTO publicaciones_categorias (publicacion_id, categoria_id) VALUES (?, ?)',
          [nuevaPublicacionId, categoriaId]
        )
      } else {
        await pool.query('ROLLBACK')
        return res.status(400).json({ message: `La categoría '${categoriaNombre}' no existe` })
      }
    }

    res.status(201).json({ message: 'Publicación creada exitosamente', postId: nuevaPublicacionId })
  } catch (err) {
    await pool.query('ROLLBACK')

    console.error('Error al crear la publicación:', err)
    return res.status(500).json({ message: 'Error al crear la publicación' })
  }
}

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { contenido, titulo, categorias, usuarioId } = req.body

    if (!id) {
      return res.status(400).json({ message: 'ID de publicación no proporcionado' })
    }

    const [existingPost] = await pool.query('SELECT * FROM publicaciones WHERE id = ?', [id])

    if (!existingPost.length) {
      return res.status(404).json({ message: 'Publicación no encontrada' })
    }

    if (existingPost[0].usuario_id !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta publicación' })
    }

    await pool.execute(
      'UPDATE publicaciones SET contenido = ?, titulo = ? WHERE id = ?',
      [contenido, titulo, id]
    )

    await pool.execute('DELETE FROM publicaciones_categorias WHERE publicacion_id = ?', [id])

    for (const categoriaNombre of categorias) {
      const [existingCategoria] = await pool.query('SELECT id FROM categorias WHERE nombre = ?', [categoriaNombre])

      if (existingCategoria.length) {
        const categoriaId = existingCategoria[0].id
        await pool.execute(
          'INSERT INTO publicaciones_categorias (publicacion_id, categoria_id) VALUES (?, ?)',
          [id, categoriaId]
        )
      } else {
        return res.status(400).json({ message: `La categoría '${categoriaNombre}' no existe` })
      }
    }

    res.status(200).json({ message: 'Publicación actualizada exitosamente' })
  } catch (err) {
    console.error('Error al actualizar la publicación:', err)

    return res.status(500).json({ message: 'Error al actualizar la publicación' })
  }
}

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const { usuarioId } = req.body

    if (!id) {
      return res.status(400).json({ message: 'ID de publicación no proporcionado' })
    }

    // Verificar si el usuario tiene permiso para eliminar la publicación
    const [existingPost] = await pool.query('SELECT * FROM publicaciones WHERE id = ?', [id])

    if (!existingPost.length) {
      return res.status(404).json({ message: 'Publicación no encontrada' })
    }

    if (existingPost[0].usuario_id !== usuarioId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' })
    }

    // Eliminar las filas en publicaciones_categorias que hacen referencia a la publicación que se va a eliminar
    await pool.execute('DELETE FROM publicaciones_categorias WHERE publicacion_id = ?', [id])

    // Luego eliminar la publicación
    await pool.execute('DELETE FROM publicaciones WHERE id = ?', [id])

    res.status(200).json({ message: 'Publicación eliminada exitosamente' })
  } catch (err) {
    console.error('Error al eliminar la publicación:', err)
    return res.status(500).json({ message: 'Error al eliminar la publicación' })
  }
}

export const getPosts = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID de usuario no proporcionado' })
    }

    const query = 'SELECT * FROM publicaciones WHERE usuario_id = ?'

    const [posts] = await pool.query(query, [id])

    res.status(200).json({ posts })
  } catch (err) {
    console.error('Error al obtener las publicaciones:', err)

    res.status(500).json({ message: 'Error al obtener las publicaciones' })
  }
}

export const getPostCategories = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID de categoría no proporcionado' })
    }

    const query = `
        SELECT pc.publicacion_id, p.titulo, p.contenido, p.usuario_id, p.nombre_usuario 
        FROM publicaciones_categorias pc
        JOIN publicaciones p ON pc.publicacion_id = p.id
        WHERE pc.categoria_id = ?
      `

    const [posts] = await pool.query(query, [id])

    res.status(200).json({ posts })
  } catch (err) {
    console.error('Error al obtener las categorías de las publicaciones:', err)

    res.status(500).json({ message: 'Error al obtener las categorías de las publicaciones' })
  }
}

export const getPostTitle = async (req, res) => {
  try {
    const { title } = req.params

    if (!title) {
      return res.status(400).json({ message: 'Debes proporcionar un título para buscar' })
    }

    const query = `
        SELECT * FROM publicaciones 
        WHERE titulo LIKE ?
      `

    const [posts] = await pool.query(query, [`%${title}%`])

    res.status(200).json({ posts })
  } catch (err) {
    console.error('Error al obtener las publicaciones por título:', err)

    res.status(500).json({ message: 'Error al obtener las publicaciones por título' })
  }
}

export const getCategory = async (req, res) => {
  try {
    const { roleId } = req.body

    if (roleId !== 1) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta función' })
    }

    const [categories] = await pool.query('SELECT * FROM categorias')

    res.status(200).json({ categories })
  } catch (err) {
    console.error('Error al obtener las categorías:', err)

    res.status(500).json({ message: 'Error al obtener las categorías' })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { roleId, nombre } = req.body

    if (roleId !== 1) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta función' })
    }

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' })
    }

    const [existingCategory] = await pool.query('SELECT * FROM categorias WHERE nombre = ?', [nombre])

    if (existingCategory.length) {
      return res.status(400).json({ message: 'La categoría ya existe' })
    }

    await pool.execute('INSERT INTO categorias (nombre) VALUES (?)', [nombre])

    res.status(201).json({ message: 'Categoría creada exitosamente' })
  } catch (err) {
    console.error('Error al crear la categoría:', err)
    res.status(500).json({ message: 'Error al crear la categoría' })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { roleId, nombre } = req.body
    const { id } = req.params

    if (roleId !== 1) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta función' })
    }

    if (!id) {
      return res.status(400).json({ message: 'ID de categoría no proporcionado' })
    }

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' })
    }

    const [existingCategory] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id])

    if (!existingCategory.length) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }

    await pool.execute('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id])

    res.status(200).json({ message: 'Categoría actualizada exitosamente' })
  } catch (err) {
    console.error('Error al actualizar la categoría:', err)

    res.status(500).json({ message: 'Error al actualizar la categoría' })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { roleId } = req.body
    const { id } = req.params

    if (roleId !== 1) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta función' })
    }

    if (!id) {
      return res.status(400).json({ message: 'ID de categoría no proporcionado' })
    }

    const [existingCategory] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id])

    if (!existingCategory.length) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }

    await pool.execute('DELETE FROM categorias WHERE id = ?', [id])

    res.status(200).json({ message: 'Categoría eliminada exitosamente' })
  } catch (err) {
    console.error('Error al eliminar la categoría:', err)
    res.status(500).json({ message: 'Error al eliminar la categoría' })
  }
}

export const createComment = async (req, res) => {
  try {
    const { id, comentario, usuarioId } = req.body

    if (!id || !comentario || !usuarioId) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    const [existingPost] = await pool.query('SELECT * FROM publicaciones WHERE id = ?', [id])
    if (!existingPost.length) {
      return res.status(404).json({ message: 'La publicación no existe' })
    }

    await pool.execute('INSERT INTO comentarios (publicacion_id, comentario, usuario_id) VALUES (?, ?, ?)', [id, comentario, usuarioId])

    res.status(201).json({ message: 'Comentario creado exitosamente' })
  } catch (err) {
    console.error('Error al crear el comentario:', err)

    return res.status(500).json({ message: 'Error al crear el comentario' })
  }
}

export const updateComments = async (req, res) => {
  try {
    const { id } = req.params
    const { comentario, userId } = req.body

    if (!id) {
      return res.status(400).json({ message: 'ID de comentario no proporcionado' })
    }

    const [existingComment] = await pool.query('SELECT * FROM comentarios WHERE id = ?', [id])
    if (!existingComment.length) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    if (existingComment[0].usuario_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este comentario' })
    }

    await pool.execute('UPDATE comentarios SET comentario = ? WHERE id = ?', [comentario, id])

    res.status(200).json({ message: 'Comentario actualizado exitosamente' })
  } catch (err) {
    console.error('Error al actualizar el comentario:', err)
    return res.status(500).json({ message: 'Error al actualizar el comentario' })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    if (!id) {
      return res.status(400).json({ message: 'ID de comentario no proporcionado' })
    }

    const [existingComment] = await pool.query('SELECT * FROM comentarios WHERE id = ?', [id])

    if (!existingComment.length) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    if (existingComment[0].usuario_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' })
    }

    await pool.execute('DELETE FROM comentarios WHERE id = ?', [id])

    res.status(200).json({ message: 'Comentario eliminado exitosamente' })
  } catch (err) {
    console.error('Error al eliminar el comentario:', err)
    return res.status(500).json({ message: 'Error al eliminar el comentario' })
  }
}

export const getCommentsByPost = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID de publicación no proporcionado' })
    }

    const query = `
        SELECT c.id, c.comentario, c.usuario_id, u.nombre AS nombre_usuario
        FROM comentarios c
        INNER JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.publicacion_id = ?
      `

    const [comments] = await pool.query(query, [id])

    res.status(200).json({ comments })
  } catch (err) {
    console.error('Error al obtener los comentarios de la publicación:', err)
    res.status(500).json({ message: 'Error al obtener los comentarios de la publicación' })
  }
}
