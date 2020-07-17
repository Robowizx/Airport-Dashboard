const jwt = require('jsonwebtoken');
const key = "icAKI50fOLKCwjIzOZAnrD0R9QE3C5ik";
let cpayload = {
    issuer:"localhost",
    audience: "localhost:4000",
    domain: "localhost"
  };
let BToken = jwt.sign(cpayload,key,{expiresIn:"30m"});
async function bToken(){
    const response = await fetch('/auth',{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'host': 'localhost',
        'Authorization': "Bearer " + BToken
        }
    });
    const { AToken } = await response.json();
    localStorage.setItem('token', AToken);
}
module.exports = bToken;