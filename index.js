const express = require('express');
const app = express()
const auth = require('./routes/role_auth')
const auth_rotues = require('./routes/auth-routes')
const passportSetup = require('./config/passport-setup')

app.set('view engine', 'html');
app.use(express.json());
app.use('/api/users',auth);
app.use('/auth',auth_rotues);

app.get('/',(req,res)=>{
    res.send('You are in the home page');
})


app.listen(3000,()=>{
    console.log("Your app is running on the port 3000");
})