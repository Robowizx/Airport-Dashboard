//importing express router
const router = require('express').Router();

//importing logger
const serverLog = require('../logger');

//importing AuthDB models
const {Application,AccessToken} = require('../model');

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
         res.status(401).send("error 401 Unauthorized");
       }
       else{
         if((req.headers.authorization && req.headers.host) && req.headers.authorization.split(" ")[0] == 'Bearer'){
           let token = req.headers.authorization.split(" ");
           jwt.verify(token[1],app.oauth_secret,(err,decode)=>{
             if(err){
              serverLog.warn(`Authentication INVALID TOKEN with client_id=${req.query.client_id}`);
              res.status(401).send("error 401 Unauthorized");
             }
             else{
               if(decode.audience == "localhost:4000"){
                 let flag=true;
                 for(let i=0;i<app.domains.length;i++){
                    if((app.domains[i] == req.headers.host) && (app.domains[i] == decode.issuer)){
                      flag=false;
                      let payload = {
                        issuer:"localhost:4000",
                        client_id: req.query.client_id,
                        audience: decode.issuer,
                        nonce: uid(32)
                      };
                      let AToken = jwt.sign(payload,process.env.KEY,{expiresIn:"30m"});
                      AccessToken.exists({application: req.query.client_id},(err,flag)=>{
                          if(err){
                            serverLog.error(`Authentication DATABASE ERROR with client_id=${req.query.client_id} -> ${err}`);
                            res.status(500).send(err);
                          }
                          else if(flag){
                            serverLog.warn(`Authentication TOKEN EXISTS with client_id=${req.query.client_id}`);
                            res.status(401).send("error 401 Unauthorized");
                          }
                          else{
                            AccessToken.create({nonce: payload.nonce, application: req.query.client_id},(err,tok)=>{
                              if(err){
                                serverLog.error(`Authentication DATABASE ERROR with client_id=${req.query.client_id} -> ${err}`);
                                res.status(500).send(err);
                              }
                              else{
                                serverLog.info(`Authentication with Access token requested by client_id = ${req.query.client_id}`);
                                res.status(200)
                                   .set({
                                     "Content-Type":"text/plain",
                                     "Content-Length":""+AToken.length
                                   })
                                   .send(AToken);
                              }
                            });
                          }
                      });
                    }
                 }
                 if(flag){
                  serverLog.warn(`Authentication INVALID ISSUER with client_id=${req.query.client_id}`);
                  res.status(401).send("error 401 Unauthorized");
                 }
               }
               else{
                serverLog.warn(`Authentication INVALID AUDIENCE with client_id=${req.query.client_id}`);
                res.status(401).send("error 401 Unauthorized");
               }
             }
           });
         }
         else{
          serverLog.warn(`Authentication NO TOKEN OR INVALID TOKEN TYPE OR NO HOST with client_id=${req.query.client_id}`);
          res.status(401).send("error 401 Unauthorized");
         }
       }  
    });
  });

  module.exports = router;