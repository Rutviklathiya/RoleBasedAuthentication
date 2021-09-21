const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

mongoose.connect('mongodb://localhost/users')
    .then(()=>{ console.log("DB Connection Successfull")})
    .catch((err)=>{console.log("DB Connection Failed due to",err)})



const userSchema = mongoose.Schema({
    userName:{
        type: String,
        minlength: 5,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    role:{
        type: String,
        required: true,
        unique: false,
        enum: {
            values: ['user','admin','superadmin'],
            message: "The role is not valid"
        }
    }
})

userSchema.methods.generateAuthToken = function(){
    // const token = jwt.sign({_id: this._id}, 'jwtPrivateKeyForRutvikNareshbhaiLathiyaMasterOfAppliedComputing');
    const token = jwt.sign({_id: this._id, role: this.role }, 'jwtPrivateKeyForRutvikNareshbhaiLathiyaMasterOfAppliedComputing');
    return token;
}

const joicreation = async (create) =>{
    const schema = Joi.object({
        userName: Joi.string().min(5).max(50),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
        role: Joi.string().valid('user','admin','superadmin').required()
    })
    return schema.validate(create)
}
module.exports.User = mongoose.model('users',userSchema);
module.exports.joicreation = joicreation