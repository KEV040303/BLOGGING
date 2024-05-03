import { Router } from 'express'
import { createPost, deletePost, getPostCategories, getPostTitle, getPosts, updatePost } from '../controller/controller.post.js'

const router = Router()

// Ruta para crear una publicacion
router.post('/post', createPost)
// Ruta para actualizar una publicacion
router.put('/post/:id', updatePost)
// Ruta para eliminar una publicacion
router.delete('/post/:id', deletePost)
// Ruta para ver publicaciones propias y de otros
router.get('/post/:id', getPosts)
// Ruta para ver publicaciones por categorias
router.get('/post/category/:id', getPostCategories)
// Ruta para ver publicaciones por titulo
router.get('/post/title/:title', getPostTitle)

export default router
