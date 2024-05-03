import express from 'express'
import { PORT } from './config/config.js'
import { pool } from './config/db.js'

const app = express()

app.use(express.json())

// Ruta para crear un nuevo usuario
app.post('/user/create', async (req, res) => {
  try {
    const { nombre, email, contraseña, usuario, roleId } = req.body

    if (!nombre || !email || !contraseña || !usuario || !roleId) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    await pool.execute('INSERT INTO usuarios (nombre, email, contraseña, usuario, role_Id) VALUES (?, ?, ?, ?, ?)', [nombre, email, contraseña, usuario, roleId])

    res.status(201).json({ message: 'Usuario creado exitosamente', user: { nombre, email, usuario, roleId } })
  } catch (err) {
    console.error('Error al insertar usuario:', err)

    return res.status(500).json({ message: 'Error al crear el usuario' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
