var express = require('express');
var router = express.Router();
let roleSchema = require('../schemas/roles');
let { Response } = require('../utils/responseHandler');
let { Authentication, Authorization } = require('../utils/authHandler');

router.get('/', Authentication, Authorization("USER", "MOD", "ADMIN"), async function (req, res, next) {
  let roles = await roleSchema.find({ isDeleted: false });
  Response(res, 200, true, roles);
});

router.get('/:id', Authentication, Authorization("USER", "MOD", "ADMIN"), async function (req, res, next) {
  try {
    let role = await roleSchema.findById(req.params.id);
    Response(res, 200, true, role);
  } catch (error) {
    Response(res, 404, false, error.message);
  }
});

router.post('/', Authentication, Authorization("MOD", "ADMIN"), async function (req, res, next) {
  let newRole = new roleSchema({
    name: req.body.name
  });
  await newRole.save();
  Response(res, 201, true, newRole);
});

module.exports = router;
