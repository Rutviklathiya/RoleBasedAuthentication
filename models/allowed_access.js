const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users')
    .then(()=>{ console.log("DB Connection Successfull")})
    .catch((err)=>{console.log("DB Connection Failed due to",err)})



const allowedSchema = mongoose.Schema( {
    _id :{
        type: String,
        minlength: 5,
        maxlength: 50
    },
    role:{
        type: String,
        required: true
    },
    allowed_url:{
        type: [String],
        required: true,
    }
})


module.exports = mongoose.model('roles',allowedSchema);