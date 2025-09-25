var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');

router.get('/', async (req, res) => {
  let categories = await categoryModel.find({ isDelete: false });
  res.send({
    success: true,
    data: categories
  });
});

router.get('/:id', async (req, res) => {
  try {
    let item = await categoryModel.findById(req.params.id);
    if (!item || item.isDelete) throw new Error('Not found');
    res.send({ success: true, data: item });
  } catch (error) {
    res.status(404).send({ success: false, data: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    let newItem = new categoryModel({ name: req.body.name });
    await newItem.save();
    res.send({ success: true, data: newItem });
  } catch (error) {
    res.status(400).send({ success: false, data: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    let updatedItem = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.send({ success: true, data: updatedItem });
  } catch (error) {
    res.status(400).send({ success: false, data: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let item = await categoryModel.findById(req.params.id);
    if (!item) throw new Error('Not found');
    item.isDelete = true;
    await item.save();
    res.send({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(404).send({ success: false, data: error.message });
  }
});

module.exports = router;
