require('dotenv').config()
const jwt = require('jsonwebtoken')

const validateJWT = (req,res,next) =>{
  const token = req.cookies.token;
  try {
      const user = jwt.verify(token, process.env.token_secret_key);
      req.user = user;
      // console.log(req.user)
      next();
    } catch (error) {
      console.log('jwt token not found')
      // req.user = undefined;
      next();
    }
  }


module.exports = {validateJWT}