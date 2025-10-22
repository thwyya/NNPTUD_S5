const { Authentication } = require('../utils/authHandler');
let { uploadAFileWithField } = require('../utils/uploadHandler')
var express = require('express');
var router = express.Router();
let users = require('../schemas/users');
let roles = require('../schemas/roles');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let allUsers = await users.find({isDeleted:false}).populate({
    path: 'role',
    select:'name'
  });
  res.send({
    success:true,
    data:allUsers
  });
});
router.get('/:id', async function(req, res, next) {
  try {
    let getUser = await users.findById(req.params.id);
    getUser = getUser.isDeleted ? new Error("ID not found") : getUser;
    res.send({
      success:true,
      data:getUser
    });
  } catch (error) {
     res.send({
      success:true,
      data:error
    });
  }
});

router.post('/', async function(req, res, next) {
  let role = req.body.role?req.body.role:"USER";
  let roleId;
  role = await roles.findOne({name:role});
  roleId = role._id;
  let newUser = new users({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
    role:roleId
  })
  await newUser.save();
  res.send({
      success:true,
      data:newUser
    })
});
router.put('/:id', async function(req, res, next) {
  let user = await users.findById(req.params.id);
  user.email = req.body.email?req.body.email:user.email;
  user.fullName = req.body.fullName?req.body.fullName:user.fullName;
  user.password = req.body.password?req.body.password:user.password;
  await user.save()
  res.send({
      success:true,
      data:user
    })
});
router.post('/upload-avatar', Authentication, uploadAFileWithField('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return Response(res, 400, false, "Không có file được upload");
    }

    const avatarURL = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
    const user = await users.findById(req.userId);

    if (!user) {
      return Response(res, 404, false, "Không tìm thấy user");
    }

    user.avatarURL = avatarURL;
    await user.save();

    Response(res, 200, true, { message: "Upload avatar thành công", avatarURL });
  } catch (err) {
    console.error(err);
    Response(res, 500, false, "Lỗi server khi upload avatar");
  }
});

module.exports = router;
