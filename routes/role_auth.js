const express = require('express');
const router = express.Router();
const {User, joicreation} = require('../models/users');
const bcrypt = require('bcrypt');
const {authenticate} = require('../middlewares/roleBasedAuth');
const auth = require('../middlewares/auth');
// const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");


router.get('/home',(req,res)=>{
    res.send("Welcome to home page");
})

router.post('/findbyrole', async(req,res)=>{
    const result = await User.find({role:req.body.role});
    res.send(result);
})

router.post('/register', async function(req,res){
    const { value, error } = await joicreation(req.body)
    if(error){ return res.status(400).send({
        status:"Bad request",
        message:"Validation failed",
        error: error.message
    })}
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const user = new User({
        userName:req.body.name,
        email:req.body.email,
        password: hashedPassword,
        role: req.body.role
    })

    try{
        await user.save().then((result)=>{ res.status(200).send({
            status: "Success",
            message:"You are successfully Registred in..",
            result,
        })});
    }catch(err){
        console.log("User creation failed due to ", err)
    }    

})
router.post('/login',async (req,res)=>{
    const { value, error } = await joicreation(req.body)
    if(error){ return res.status(400).send({
        status:"Bad request",
        message:"Validation failed"
    })}
    let user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Invalid Email ID');

    const isMatched = bcrypt.compareSync(req.body.password, user.password);

    if(!isMatched) return res.status(400).send('Invalid Email or Password .');

    const token = user.generateAuthToken();
    // res.redirect('/api/users/home')
    res.send({
        status: "Success",
        message:"You are successfully logged in..",
        token,
    })

})


router.put('/changepass', async(req,res)=>{

    try{
        let user = await User.findOne({email:req.body.email});
        if(!user) return res.status(400).send({
            status: "Change password failed",
            message:"Your email is not registered"
        });
        const isMatched = await bcrypt.compare(req.body.oldPassword, user.password);
        if(!isMatched){ 
        return res.status(400).send({
            status: "Change password failed",
            message:"Your old password is incorrect hence you are not able to change the password"
        });
    }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt)
        if(user.password==hashedPassword){
            return res.send({
                status: "Change password failed",
                message:"New password can not be the same as old password"
            })
        }
        const result = await User.updateOne({email:req.body.email},{password:hashedPassword})
        if(!result){ 
            return res.send({
            status:"Change Password Failed",
            message:"Email id does not matched"
        })}
    

        // res.redirect('/api/users/home')
        res.send({
            status: "Change Password Successfull",
            message:"Your password has been successfully changed",
            result: result
        })
    }catch(err){
        console.log("There was an error due to: ",err)
    }

})



router.post('/level1',[auth,authenticate],async(req,res)=>{

    res.status(200).send({
        status:"Success",
        message:"You have access to level1"
    });
})

router.post('/level2',[auth,authenticate],async(req,res)=>{
    res.send({
        status:"Success",
        message:"You have access to level2"
    });
})

router.post('/level3',[auth,authenticate],async(req,res)=>{
    res.send({
        status:"Success",
        message:"You have access to level3"
    });
})


router.post('/sendemail',(req,res)=>{
    const msg = {
        to: 'rutviklathiya233@gmail.com',
        from: 'sbsbsb2605@gmail.com', // Use the email address or domain you verified above
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      //ES6
      sgMail
        .send(msg)
        .then(() => {
            res.send("Your mail has sent")
        }, error => {
          console.error(error);
      
          if (error.response) {
            console.error(error.response.body)
          }
          res.send(error);
        });
})

router.post('/forgotpass', async (req,res)=>{
    const result = await User.findOne({email:req.body.email});
    if(!result) { return res.status(400).send('Invalid Email ID'); }
    else{
    const msg = {
        to: req.body.email,
        from: 'sbsbsb2605@gmail.com', // Use the email address or domain you verified above
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'Now you are able to change the password',
        html: '<p>Please follow <a href="http://localhost:3000/api/users/home">this link</a>.</p>',
      };
      //ES6
      sgMail
        .send(msg)
        .then(() => {
            res.send('Your email change password is set')
        }, error => {
          console.error(error);
      
          if (error.response) {
            console.error(error.response.body)
          }
          res.send(error);
        });
    }
})

module.exports = router;