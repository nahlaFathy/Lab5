
const mongoose = require('mongoose');

const todoSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'  ,
        required:true 
    },
    title:{type:String,required:true,minlength:10,maxlength:20},
    body:{type:String,required:true,minlength:10,maxlength:500},
    tags:[{
        type:String,
        maxlength:10,
        required:false
    }],
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date}
  
})

const Todo=mongoose.model('todo',todoSchema)

module.exports=Todo;