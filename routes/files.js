var express = require('express');
var router = express.Router();
var path = require('path')
let fs = require('fs')
let multer = require('multer');
const { Response } = require('../utils/responseHandler');

router.get('/:filename', function (req, res, next) {
    let pathFile = path.join(__dirname, "../resources/files/", req.params.filename);
    if (fs.existsSync(pathFile)) {
        res.status(200).sendFile(pathFile);
    } else {
        Response(res, 404, false, "File not found");
    }
})

let Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            let pathFileStorage = path.join(__dirname, "../resources/images");
            cb(null, pathFileStorage);
        } else {
            let pathFileStorage = path.join(__dirname, "../resources/files");
            cb(null, pathFileStorage);
        }

    },
    filename: function (req, file, cb) {
        let extensionName = path.extname(file.originalname)
        cb(null, Date.now() + extensionName);
    }
})
let upload = multer({
    storage: Storage,
    fileFilter:function(req,file,cb){
        console.log(file.mimetype);
        if(!file.mimetype.startsWith("image")&&!file.mimetype.startsWith("application/pdf")){
            cb(null,false)
        }else{
            cb(null,true)
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})
router.post("/uploads", upload.single('image'), function (req, res, next) {
    let URL = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
    Response(res, 200, true, URL)
})


module.exports = router;