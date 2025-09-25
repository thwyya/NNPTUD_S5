let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name cannot be empty"],
        unique: true
    },
    isDelete:{
        type: Boolean,
        default: false
    }
},{
    timestamps:true
});

module.exports = mongoose.model('category', schema);
