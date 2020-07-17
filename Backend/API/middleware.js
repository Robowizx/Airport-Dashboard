//importing logger
const serverLog = require('./logger');
const jwt = require('jsonwebtoken');
const key = "icAKI50fOLKCwjIzOZAnrD0R9QE3C5ik";

export const bToken = async ()=>{
    let cpayload = {
        issuer:"localhost",
        audience: "localhost:4000",
        domain: "localhost"
      };
    let BToken = jwt.sign(cpayload,key,{expiresIn:"30m"});
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

export const checkToken = (req, res, next) => {
  let token = localStorage.getItem('token'); 
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        serverLog.warn(`Authentication TOKEN Err: ${err}`)
        res.status(401).send("error 401 Unauthorized");
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    serverLog.warn(`Authentication DATA NOT FOUND`);
    res.status(401).send("error 401 Unauthorized");
  }
};
