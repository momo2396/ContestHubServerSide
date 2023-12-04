require('dotenv').config()
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET

let genToken = async (payload) => {
    
    const token = jwt.sign(payload, secret);
  
    return token
}

module.exports = genToken