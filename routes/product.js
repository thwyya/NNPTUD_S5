var express = require('express');
var router = express.Router();
let productSchema = require('../schemas/products');
let { Response } = require('../utils/responseHandler');
let { Authentication, Authorization } = require('../utils/authHandler');

router.get('/', Authentication, Authorization("USER", "MOD", "ADMIN"), async function (req, res, next) {
  let products = await productSchema.find({ isDeleted: false });
  Response(res, 200, true, products);
});

router.get('/:id', Authentication, Authorization("USER", "MOD", "ADMIN"), async function (req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product || product.isDeleted) throw new Error("Không tìm thấy sản phẩm");
    Response(res, 200, true, product);
  } catch (error) {
    Response(res, 404, false, error.message);
  }
});

router.post('/', Authentication, Authorization("MOD", "ADMIN"), async function (req, res, next) {
  let newProduct = new productSchema(req.body);
  await newProduct.save();
  Response(res, 201, true, newProduct);
});

router.put('/:id', Authentication, Authorization("MOD", "ADMIN"), async function (req, res, next) {
  let product = await productSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
  Response(res, 200, true, product);
});

router.delete('/:id', Authentication, Authorization("ADMIN"), async function (req, res, next) {
  let product = await productSchema.findById(req.params.id);
  if (!product) return Response(res, 404, false, "Không tìm thấy sản phẩm");
  product.isDeleted = true;
  await product.save();
  Response(res, 200, true, "Xóa sản phẩm thành công");
});

module.exports = router;
