import { Router } from 'express'
import { createComment, updateComments, deleteComment, getCommentsByPost } from '../controller/controller.comment'

const router = Router()

// Ruta para crear un comentario
router.post('/comment', createComment)
// Ryta para editar un comentario
router.put('/comment/:id', updateComments)
// Ruta para eliminar un comentario
router.delete('/comment/:id', deleteComment)
// Ruta para obtener los comentarios de cada publicacion
router.get('/comment/:id', getCommentsByPost)

export default router
