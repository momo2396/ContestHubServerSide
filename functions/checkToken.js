require('dotenv').config()
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET

let checkToken = async (token) => {
   
    try {
        let decoded = jwt.verify(token, secret);
       
        return decoded
    } catch (err) {
        // err
        return { userEmail: null, status: "unauthorized" }
    }
}

module.exports = checkToken