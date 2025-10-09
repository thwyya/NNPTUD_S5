var express = require('express');
var router = express.Router();
let users = require('../schemas/users');
let roles = require('../schemas/roles');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken')


router.post('/register', async function(req, res, next) {
  let role = await roles.findOne({name:"USER"});
  role = role._id;
  let newUser = new users({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
    role:role
  })
  await newUser.save();
  res.send({
      success:true,
      data:"dang ki thanh cong"
    })
});
router.post('/login', async function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let user = await users.findOne({
    username:username
  })
  if(user.length==0){
    res.status(404).send({
      success:true,
      data:"user khong ton tai"
    })
    return;
  }else{
    let result = bcrypt.compareSync(password,user.password);
    if(result){
    res.send({
      success:true,
      data:jwt.sign({
        _id:user._id,
        exp:Date.now()+15*60*1000
      },"NNPTUD")
    })
    }else{
      res.send({
      success:true,
      data:"user sai password"
    })
    }
  }
});

router.get('/me',async function(req, res, next){
  let token = req.headers.authorization;
  if(token.startsWith("Bearer")){
    token = token.split(" ")[1];
    if(jwt.verify(token,"NNPTUD")){
      if(jwt.decode(token).exp<Date.now()){
        res.status(403).send({
          success:false,
          data:"user chua dang nhap 1"
        })
      }else{
        let userId = jwt.decode(token)._id;
        let user = await users.findById(userId).populate({
    path: 'role',
    select:'name'
  });
        if(user){
            res.status(200).send({
              success:true,
              data:user
            })
        }
      }
    }else{
      res.status(403).send({
        success:false,
        data:"user chua dang nhap 2"
      })
    }
  }else{
    res.status(403).send({
      success:false,
      data:"user chua dang nhap 3"
    })
  }
})

module.exports = router;
