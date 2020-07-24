//importing express router
const router = require('express').Router();

//importing logger
const serverLog = require('../logger');

//importing AuthDB models
const {Application} = require('../model');

//importing JWT module
const jwt = require('jsonwebtoken');
const uid = require('uid2');

router.get("/auth",(req,res)=>{
    Application.findOne({oauth_id: req.query.client_id},(err,app)=>{
       if(err){
         serverLog.error(`Authentication DATABASE ERROR with client_id=${req.query.client_id} -> ${err}`);
         res.status(500).send(err);
       }
       else if(!app){
         serverLog.warn(`Authentication DATA NOT FOUND with client_id=${req.query.client_id}`);
         res.status(403).send("error 403 Forbidden");
       }
       else{
         if((req.headers.authorization && req.headers.host) && req.headers.authorization.split(" ")[0] == 'Bearer'){
           let token = req.headers.authorization.split(" ");
           jwt.verify(token[1],app.oauth_secret,{algorithms:'HS512',issuer:req.headers.host,audience:'localhost:4000'},(err,decode)=>{
             if(err){
              serverLog.warn(`Authentication INVALID TOKEN with client_id=${req.query.client_id}`);
              res.status(401).send("error 401 Unauthorized");
             }
             else{
                let flag=true;
                for(let i=0;i<app.domains.length;i++){
                   if(app.domains[i] == req.headers.host){
                     flag=false;
                     let payload = {
                       issuer:"localhost:4000",
                       client_id: req.query.client_id,
                       audience: decode.issuer
                     };
                     let AToken = jwt.sign(payload,process.env.KEY,{expiresIn:"30m",algorithm:'HS512'});
                     serverLog.info(`Authentication Access token requested by client_id = ${req.query.client_id}`);
                               res.status(200)
                                  .set({
                                    "Content-Type":"text/plain",
                                    "Content-Length":""+AToken.length
                                  })
                                  .send(AToken);
                   }
                 }
                 if(flag){
                  serverLog.warn(`Authentication INVALID ISSUER with client_id=${req.query.client_id}`);
                  res.status(401).send("error 401 Unauthorized");
                 }
             }
           });
         }
         else{
          serverLog.warn(`Authentication NO TOKEN OR INVALID TOKEN TYPE OR NO HOST with client_id=${req.query.client_id}`);
          res.status(400).send("error 400 Bad request");
         }
       }  
    });
  });

  module.exports = router;