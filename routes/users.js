var express = require('express');
var router = express.Router();
let users = require('../schemas/users');
let roles = require('../schemas/roles');
let { Response } = require('../utils/responseHandler');
let { Authentication, Authorization } = require('../utils/authHandler');

router.get('/', Authentication, Authorization("USER", "MOD", "ADMIN"), async function (req, res, next) {
  let allUsers = await users.find({ isDeleted: false }).populate({
    path: 'role',
    select: 'name'
  });
  Response(res, 200, true, allUsers);
});

router.get('/:id', Authentication, Authorization("USER", "MOD", "ADMIN"), async function (req, res, next) {
  try {
    let getUser = await users.findById(req.params.id);
    if (!getUser || getUser.isDeleted) throw new Error("ID not found");
    Response(res, 200, true, getUser);
  } catch (error) {
    Response(res, 404, false, error.message);
  }
});

router.post('/', Authentication, Authorization("MOD", "ADMIN"), async function (req, res, next) {
  let role = req.body.role ? req.body.role : "USER";
  let roleId;
  role = await roles.findOne({ name: role });
  roleId = role._id;
  let newUser = new users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: roleId
  });
  await newUser.save();
  Response(res, 201, true, newUser);
});

router.put('/:id', Authentication, Authorization("MOD", "ADMIN"), async function (req, res, next) {
  let user = await users.findById(req.params.id);
  if (!user) return Response(res, 404, false, "User not found");
  user.email = req.body.email ? req.body.email : user.email;
  user.fullName = req.body.fullName ? req.body.fullName : user.fullName;
  user.password = req.body.password ? req.body.password : user.password;
  await user.save();
  Response(res, 200, true, user);
});

router.delete('/:id', Authentication, Authorization("ADMIN"), async function (req, res, next) {
  let user = await users.findById(req.params.id);
  if (!user) return Response(res, 404, false, "User not found");
  user.isDeleted = true;
  await user.save();
  Response(res, 200, true, "Xóa user thành công");
});

module.exports = router;
