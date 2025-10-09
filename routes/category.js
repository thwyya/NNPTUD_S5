var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/categories');
let { Response } = require('../utils/responseHandler');
let { Authentication, Authorization } = require('../utils/authHandler');

router.get('/', Authentication, Authorization("USER", "MOD", "ADMIN"), async function (req, res, next) {
  let categories = await categorySchema.find({ isDeleted: false });
  Response(res, 200, true, categories);
});

router.get('/:id', Authentication, Authorization("USER", "MOD", "ADMIN"), async function (req, res, next) {
  try {
    let category = await categorySchema.findById(req.params.id);
    if (!category || category.isDeleted) throw new Error("Không tìm thấy danh mục");
    Response(res, 200, true, category);
  } catch (error) {
    Response(res, 404, false, error.message);
  }
});

router.post('/', Authentication, Authorization("MOD", "ADMIN"), async function (req, res, next) {
  let newCategory = new categorySchema(req.body);
  await newCategory.save();
  Response(res, 201, true, newCategory);
});

router.put('/:id', Authentication, Authorization("MOD", "ADMIN"), async function (req, res, next) {
  let category = await categorySchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
  Response(res, 200, true, category);
});

router.delete('/:id', Authentication, Authorization("ADMIN"), async function (req, res, next) {
  let category = await categorySchema.findById(req.params.id);
  if (!category) return Response(res, 404, false, "Không tìm thấy danh mục");
  category.isDeleted = true;
  await category.save();
  Response(res, 200, true, "Xóa danh mục thành công");
});

module.exports = router;
