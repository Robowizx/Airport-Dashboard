//importing express router
const router = require('express').Router();

//importing jwt module
const jwt = require('jsonwebtoken');

//importing logger
const serverlog = require('../logger');

router.get('/',(req,res,next)=>{
    if((req.headers.authorization && req.headers.host) && req.headers.authorization.split(' ')[0]=='Bearer'){
        jwt.verify(req.headers.authorization.split(' ')[1],process.env.KEY,{algorithms:'HS512',issuer:'localhost:4000',audience:req.headers.host},(err,decode)=>{
            if(err){
                serverlog.warn(`Gatekeeper INVALID TOKEN with Host=${req.headers.host}`);
                res.status(401).send('error 401 Unauthorised');
            }
            else{
                next();
            }
        });
    }
    else{
        if(req.host){
            serverlog.warn(`GateKeeper NO TOKEN or INVALID TOKEN TYPE provided in request with Host = ${req.headers.host}`);
            res.status(400).send('error 400 Bad request');
        }
        else{
            serverlog.warn(`GateKeeper NO TOKEN or INVALID TOKEN TYPE or NO HOST provided in request`);
            res.status(400).send('error 400 Bad request');
        }
    }
});

module.exports = router;