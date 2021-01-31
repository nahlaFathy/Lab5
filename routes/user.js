const bcrypt=require('bcrypt')
const _=require('lodash');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../schema/user');
const auth=require('../middleware/auth')




//////////////////////////////////////////  1 ///////////////////////////////////////

router.post('/register',body('username').isLength({ min: 1 })
.withMessage('username is required'),
body('password').isLength({ min: 4 })
.withMessage('password is required')
, body('firstname').isLength({ min: 1 })
.withMessage('firstname is required')
, async(req, res) => {
       ///// body validation
       const errors = validationResult(req); 
       if (!errors.isEmpty()) return res.status(400).send({error: errors.errors[0].msg });        
       
       ////// chech if user register before
       let isUser=await User.findOne({username:req.body.username})
       if(isUser) return res.status(400).send('user already registered') 
       ////// create new user
       const user =new User(_.pick(req.body,['username','password','firstname','age']))
       //// hashing password
       const salt=await bcrypt.genSalt(10);
       user.password=await bcrypt.hash(user.password,salt)
      
       ///// save new user
    try{
        await user.save()
       
       return res.send({message:'user was registered successfully',token}) 
    }
    catch(err){
        res.send({error:err}) 
    }
    
  })


///////////////////////////////////////// 3 ////////////////////////////////////////////
  router.get('/', auth, async(req, res)=> {
  
    const users= await User.find().select({firstname:1,_id:1})
    
     return res.send('registered users :' + users)
 
    })


////////////////////////// 4  /////////////////////////////////////////////

   router.patch('/', auth,async(req, res) => {
 
    const loginedID=req.user._id
    const user= await User.findByIdAndUpdate(loginedID,{
        $set:{
         username:req.body.username,
         password:req.body.password,
         firstname:req.body.firstname,
         age:req.body.age
        }
    },{new:true});
        if(user)
          return res.send({message:'user was edited successfully',user:user})
        else
          return  res.send({message:'This user id is not exist'})

   })

  ////////////////////////////// 5 //////////////////////////

   router.delete('/',auth, async(req, res) => {
        const loginedID=req.user._id
        const user= await User.findByIdAndRemove(loginedID);
        if(user) return res.send({message:'user deleted successfuly'})
   })
  
    module.exports=router
   