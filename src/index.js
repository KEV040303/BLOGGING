import express from 'express'
import { PORT } from './config/config.js'
import { createUser, updateUser, deleteUser, getUsers, createPost, updatePost, deletePost, getPosts, getPostCategories, getPostTitle, getCategory, createCategory, updateCategory, deleteCategory, createComment, updateComments, deleteComment, getCommentsByPost } from './controller.js'

const app = express()

app.use(express.json())

// USER
// Ruta para crear el nuevo usuario
app.post('/user', createUser)
// Ruta para actualizar el usuario
app.put('/user/:id', updateUser)
// Ruta para eliminar el usuario
app.delete('/user/:id', deleteUser)
// Ruta para obtener todos los usuarios
app.get('/users', getUsers)

// POST
// Ruta para crear una publicacion
app.post('/post', createPost)
// Ruta para actualizar una publicacion
app.put('/post/:id', updatePost)
// Ruta para eliminar una publicacion
app.delete('/post/:id', deletePost)
// Ruta para ver publicaciones propias y de otros
app.get('/post/:id', getPosts)
// Ruta para ver publicaciones por categorias
app.get('/post/category/:id', getPostCategories)
// Ruta para ver publicaciones por titulo
app.get('/post/title/:title', getPostTitle)

// Ruta del admin para ver las categorias
app.get('/category', getCategory)
// Ruta del admin para crear una categoria
app.post('/category', createCategory)
// Ruta del admin para editar una categoria
app.put('/category/:id', updateCategory)
// Ruta del admin para eliminar una categoria
app.delete('/category/:id', deleteCategory)

// Ruta para crear un comentario
app.post('/comment', createComment)
// Ryta para editar un comentario
app.put('/comment/:id', updateComments)
// Ruta para eliminar un comentario
app.delete('/comment/:id', deleteComment)
// Ruta para obtener los comentarios de cada publicacion
app.get('/comment/:id', getCommentsByPost)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
