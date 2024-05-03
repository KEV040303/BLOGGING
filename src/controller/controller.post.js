import { pool } from '../config/db.js'

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
