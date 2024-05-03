import { Router } from 'express'
import { createPost, deletePost, getPostCategories, getPostTitle, getPosts, updatePost } from '../controller/controller.post.js'

const router = Router()

/**
 * @openapi
 * /post:
 *   post:
 *     summary: Crea una nueva publicación
 *     description: Crea una nueva publicación con contenido, título, usuario y categorías.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       '201':
 *         description: Publicación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreatePostResponse'
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al crear la publicación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/post', createPost)

/**
 * @openapi
 * /post/{id}:
 *   put:
 *     summary: Actualiza una publicación
 *     description: Actualiza el contenido, título y categorías de una publicación existente.
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
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *     responses:
 *       '200':
 *         description: Publicación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: No tienes permiso para actualizar esta publicación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Publicación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al actualizar la publicación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/post/:id', updatePost)

/**
 * @openapi
 * /post/{id}:
 *   delete:
 *     summary: Elimina una publicación
 *     description: Elimina una publicación existente de la base de datos.
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
 *             $ref: '#/components/schemas/DeletePostRequest'
 *     responses:
 *       '200':
 *         description: Publicación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: No tienes permiso para eliminar esta publicación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Publicación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al eliminar la publicación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/post/:id', deletePost)

/**
 * @openapi
 * /post/{id}:
 *   get:
 *     summary: Obtiene las publicaciones de un usuario
 *     description: Devuelve todas las publicaciones de un usuario específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Publicaciones obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al obtener las publicaciones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/post/:id', getPosts)

/**
 * @openapi
 * /post/category/{id}:
 *   get:
 *     summary: Obtiene publicaciones por categoría
 *     description: Devuelve todas las publicaciones que pertenecen a una categoría específica.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Publicaciones obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al obtener las publicaciones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/post/category/:id', getPostCategories)

/**
* @openapi
* /post/title/{title}:
*   get:
*     summary: Obtiene publicaciones por título
*     description: Devuelve todas las publicaciones que coinciden parcialmente con un título específico.
*     parameters:
*       - in: path
*         name: title
*         required: true
*         schema:
*           type: string
*     responses:
*       '200':
*         description: Publicaciones obtenidas exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 posts:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Post'
*       '400':
*         description: Solicitud inválida
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Error'
*       '500':
*         description: Error al obtener las publicaciones
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Error'
*/
router.get('/post/title/:title', getPostTitle)

export default router
