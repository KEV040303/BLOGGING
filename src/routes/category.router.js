import { Router } from 'express'
import { getCategory, createCategory, updateCategory, deleteCategory } from '../controller/controller.category.js'

const router = Router()

// Ruta del admin para ver las categorias
router.get('/category', getCategory)
// Ruta del admin para crear una categoria
router.post('/category', createCategory)
// Ruta del admin para editar una categoria
router.put('/category/:id', updateCategory)
// Ruta del admin para eliminar una categoria
router.delete('/category/:id', deleteCategory)

export default router
