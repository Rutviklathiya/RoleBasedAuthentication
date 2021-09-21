const Auth = require('../models/allowed_access');
const {User} = require('../models/users');

const authenticate = async function(req,res,next){
        console.log('------')
    try{
        // const result = await req.user
        const result = await User.findById(req.user._id);
        console.log("result: ",result);
        const result_auth = await Auth.findOne({role:result.role})
        console.log(result_auth.allowed_url);
        console.log(req.url);
        if((result_auth.allowed_url.includes(req.url))){
            next();
        }
        else{
            res.status(500).send("You have a lower access");
        }
    }catch(err){
        console.log("You have an error due to",err);
    }
 
}

module.exports = {authenticate};