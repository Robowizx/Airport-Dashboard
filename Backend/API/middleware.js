//importing logger
const serverLog = require('./logger');
const jwt = require('jsonwebtoken');
const key = "icAKI50fOLKCwjIzOZAnrD0R9QE3C5ik";

export const bToken = async ()=>{
    let cpayload = {
        issuer:"localhost",
        audience: "localhost:4000",
      };
    let BToken = jwt.sign(cpayload,key,{expiresIn:"30m"});
    const response = await fetch('/auth',{
        method: 'GET',
        headers: {
        'host': 'localhost',
        'Authorization': "Bearer " + BToken
        }
    });
    const { AToken } = await response.json();
    return AToken;
}

