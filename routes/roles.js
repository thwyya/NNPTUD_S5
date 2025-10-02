const express = require('express');
const router = express.Router();
const Role = require('../schemas/role');

// Create
router.post('/', async (req, res) => {
  try {
    const newRole = await Role.create(req.body);
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find({ isDelete: false });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get by ID
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDelete: false });
    if (!role) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Soft delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Role.findByIdAndUpdate(req.params.id, { isDelete: true }, { new: true });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
