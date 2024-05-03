import { pool } from '../config/db.js'

export const getCategory = async (req, res) => {
  try {
    const { roleId } = req.body

    if (roleId !== 1) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta función' })
    }

    const [categories] = await pool.query('SELECT * FROM categorias')

    res.status(200).json({ categories })
  } catch (err) {
    console.error('Error al obtener las categorías:', err)

    res.status(500).json({ message: 'Error al obtener las categorías' })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { roleId, nombre } = req.body

    if (roleId !== 1) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta función' })
    }

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' })
    }

    const [existingCategory] = await pool.query('SELECT * FROM categorias WHERE nombre = ?', [nombre])

    if (existingCategory.length) {
      return res.status(400).json({ message: 'La categoría ya existe' })
    }

    await pool.execute('INSERT INTO categorias (nombre) VALUES (?)', [nombre])

    res.status(201).json({ message: 'Categoría creada exitosamente' })
  } catch (err) {
    console.error('Error al crear la categoría:', err)
    res.status(500).json({ message: 'Error al crear la categoría' })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { roleId, nombre } = req.body
    const { id } = req.params

    if (roleId !== 1) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta función' })
    }

    if (!id) {
      return res.status(400).json({ message: 'ID de categoría no proporcionado' })
    }

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' })
    }

    const [existingCategory] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id])

    if (!existingCategory.length) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }

    await pool.execute('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id])

    res.status(200).json({ message: 'Categoría actualizada exitosamente' })
  } catch (err) {
    console.error('Error al actualizar la categoría:', err)

    res.status(500).json({ message: 'Error al actualizar la categoría' })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { roleId } = req.body
    const { id } = req.params

    if (roleId !== 1) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta función' })
    }

    if (!id) {
      return res.status(400).json({ message: 'ID de categoría no proporcionado' })
    }

    const [existingCategory] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id])

    if (!existingCategory.length) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }

    await pool.execute('DELETE FROM categorias WHERE id = ?', [id])

    res.status(200).json({ message: 'Categoría eliminada exitosamente' })
  } catch (err) {
    console.error('Error al eliminar la categoría:', err)
    res.status(500).json({ message: 'Error al eliminar la categoría' })
  }
}
