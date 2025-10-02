const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

// Create User
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all + tìm theo username, fullName (chứa)
router.get('/', async (req, res) => {
  try {
    const { username, fullName } = req.query;
    let filter = { isDelete: false };

    if (username) filter.username = { $regex: username, $options: 'i' };
    if (fullName) filter.fullName = { $regex: fullName, $options: 'i' };

    const users = await User.find(filter).populate('role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDelete: false });
    if (!user) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get by username
router.get('/username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username, isDelete: false });
    if (!user) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Soft delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndUpdate(req.params.id, { isDelete: true }, { new: true });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hàm post: kiểm tra username + email, set status = true
router.post('/activate', async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findOne({ username, email, isDelete: false });
    if (!user) return res.status(404).json({ error: 'Sai username hoặc email' });

    user.status = true;
    await user.save();
    res.json({ message: 'Đã kích hoạt thành công', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
