import { pool } from '../config/db.js'

export const createComment = async (req, res) => {
  try {
    const { id, comentario, usuarioId } = req.body

    if (!id || !comentario || !usuarioId) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    const [existingPost] = await pool.query('SELECT * FROM publicaciones WHERE id = ?', [id])
    if (!existingPost.length) {
      return res.status(404).json({ message: 'La publicación no existe' })
    }

    await pool.execute('INSERT INTO comentarios (publicacion_id, comentario, usuario_id) VALUES (?, ?, ?)', [id, comentario, usuarioId])

    res.status(201).json({ message: 'Comentario creado exitosamente' })
  } catch (err) {
    console.error('Error al crear el comentario:', err)

    return res.status(500).json({ message: 'Error al crear el comentario' })
  }
}

export const updateComments = async (req, res) => {
  try {
    const { id } = req.params
    const { comentario, userId } = req.body

    if (!id) {
      return res.status(400).json({ message: 'ID de comentario no proporcionado' })
    }

    const [existingComment] = await pool.query('SELECT * FROM comentarios WHERE id = ?', [id])
    if (!existingComment.length) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    if (existingComment[0].usuario_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este comentario' })
    }

    await pool.execute('UPDATE comentarios SET comentario = ? WHERE id = ?', [comentario, id])

    res.status(200).json({ message: 'Comentario actualizado exitosamente' })
  } catch (err) {
    console.error('Error al actualizar el comentario:', err)
    return res.status(500).json({ message: 'Error al actualizar el comentario' })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    if (!id) {
      return res.status(400).json({ message: 'ID de comentario no proporcionado' })
    }

    const [existingComment] = await pool.query('SELECT * FROM comentarios WHERE id = ?', [id])

    if (!existingComment.length) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    if (existingComment[0].usuario_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' })
    }

    await pool.execute('DELETE FROM comentarios WHERE id = ?', [id])

    res.status(200).json({ message: 'Comentario eliminado exitosamente' })
  } catch (err) {
    console.error('Error al eliminar el comentario:', err)
    return res.status(500).json({ message: 'Error al eliminar el comentario' })
  }
}

export const getCommentsByPost = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID de publicación no proporcionado' })
    }

    const query = `
          SELECT c.id, c.comentario, c.usuario_id, u.nombre AS nombre_usuario
          FROM comentarios c
          INNER JOIN usuarios u ON c.usuario_id = u.id
          WHERE c.publicacion_id = ?
        `

    const [comments] = await pool.query(query, [id])

    res.status(200).json({ comments })
  } catch (err) {
    console.error('Error al obtener los comentarios de la publicación:', err)
    res.status(500).json({ message: 'Error al obtener los comentarios de la publicación' })
  }
}
