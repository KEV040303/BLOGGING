import express from 'express'
import { PORT } from './config/config.js'
import { createUser, updateUser, deleteUser, getUsers, createPost, updatePost } from './controller.js'

const app = express()

app.use(express.json())

// Ruta para crear el nuevo usuario
app.post('/user', createUser)
// Ruta para actualizar el usuario
app.put('/user/:id', updateUser)
// Ruta para eliminar el usuario
app.delete('/user/:id', deleteUser)
// Ruta para obtener todos los usuarios
app.get('/users', getUsers)

// Ruta para crear una publicacion
app.post('/post', createPost)
// Ruta para actualizar una publicacion
app.put('/post/:id', updatePost)
// Ruta para eliminar una publicacion
app.delete('/post/:id', deleteUser)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
