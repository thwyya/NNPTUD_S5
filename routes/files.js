var express = require('express');
var router = express.Router();
var path = require('path')
let fs = require('fs')

router.get('/:filename', function (req, res, next) {
    let pathFile = path.join( __dirname,"../resources/files/",req.params.filename);
    if(fs.existsSync(pathFile)){
       res.status(200).sendFile(pathFile);
    }else{
        Response(res, 404, false, "File not found");
    }
})

module.exports = router;