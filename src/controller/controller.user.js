import { pool } from '../config/db.js'

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
