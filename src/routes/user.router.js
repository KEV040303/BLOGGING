import { Router } from 'express'
import { createUser, deleteUser, getUsers, updateUser } from '../controller/controller.user.js'

const router = Router()

// Ruta para crear el nuevo usuario
router.post('/user', createUser)
// Ruta para actualizar el usuario
router.put('/user/:id', updateUser)
// Ruta para eliminar el usuario
router.delete('/user/:id', deleteUser)
// Ruta para obtener todos los usuarios
router.get('/user', getUsers)

export default router
