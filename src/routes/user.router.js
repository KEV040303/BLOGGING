import { Router } from 'express'
import { createUser, deleteUser, getUsers, updateUser } from '../controller/controller.user.js'

const router = Router()

/**
* @openapi
* /user:
*   post:
*     summary: Crea un nuevo usuario
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               nombre:
*                 type: string
*               email:
*                 type: string
*               contraseña:
*                 type: string
*               usuario:
*                 type: string
*               roleId:
*                 type: integer
*             required:
*               - nombre
*               - email
*               - contraseña
*               - usuario
*               - roleId
*     responses:
*       '201':
*         description: Usuario creado exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 user:
*                   type: object
*                   properties:
*                     nombre:
*                       type: string
*                     email:
*                       type: string
*                     usuario:
*                       type: string
*                     roleId:
*                       type: integer
*       '400':
*         description: Todos los campos son obligatorios
*       '500':
*         description: Error al crear el usuario
*/
router.post('/user', createUser)

/**
* @openapi
* /user/{id}:
*   put:
*     summary: Actualiza un usuario
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               nombre:
*                 type: string
*               email:
*                 type: string
*               contraseña:
*                 type: string
*               usuario:
*                 type: string
*               roleId:
*                 type: integer
*               userId:
*                 type: integer
*             required:
*               - userId
*     responses:
*       '200':
*         description: Usuario actualizado exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 user:
*                   type: object
*       '400':
*         description: ID de usuario no proporcionado / Debe proporcionar al menos uno de los campos para actualizar / El correo electrónico ya está registrado
*       '403':
*         description: No tienes permiso para actualizar este usuario
*       '404':
*         description: Usuario no encontrado
*       '500':
*         description: Error al actualizar el usuario
*/
router.put('/user/:id', updateUser)

/**
* @openapi
* /user/{id}:
*   delete:
*     summary: Elimina un usuario
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               userId:
*                 type: integer
*             required:
*               - userId
*     responses:
*       '200':
*         description: Usuario eliminado exitosamente
*       '400':
*         description: ID de usuario no proporcionado
*       '403':
*         description: No tienes permiso para eliminar este usuario
*       '404':
*         description: Usuario no encontrado
*       '500':
*         description: Error al eliminar el usuario
*/
router.delete('/user/:id', deleteUser)

/**
* @openapi
* /user:
*   get:
*     summary: Obtiene todos los usuarios
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               roleId:
*                 type: integer
*     responses:
*       '200':
*         description: Usuarios obtenidos exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 users:
*                   type: array
*                   items:
*                     type: object
*       '403':
*         description: No tienes permiso para acceder a esta función
*       '500':
*         description: Error al obtener usuarios
*/
router.get('/user', getUsers)

export default router
