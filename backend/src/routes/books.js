const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
router.post('/', async (req, res) => {
  const { campo1, campo2, campo3, campo4, campo5, campo6 } = req.body;
  if (!campo1 || !campo2 || !campo3 || campo4 === undefined || campo5 === undefined || campo6 === undefined) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO books (campo1, campo2, campo3, campo4, campo5, campo6) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [campo1, campo2, campo3, campo4, campo5, campo6]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { campo1, campo2, campo3, campo4, campo5, campo6 } = req.body;
  if (!campo1 || !campo2 || !campo3 || campo4 === undefined || campo5 === undefined || campo6 === undefined) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  try {
    const result = await pool.query(
      'UPDATE books SET campo1=$1, campo2=$2, campo3=$3, campo4=$4, campo5=$5, campo6=$6 WHERE id=$7 RETURNING *',
      [campo1, campo2, campo3, campo4, campo5, campo6, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH
router.patch('/:id', async (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);
  if (keys.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

  const setClause = keys.map((k, i) => `${k}=$${i + 1}`).join(', ');
  const values = keys.map(k => fields[k]);
  values.push(req.params.id);

  try {
    const result = await pool.query(
      `UPDATE books SET ${setClause} WHERE id=$${values.length} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM books WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;