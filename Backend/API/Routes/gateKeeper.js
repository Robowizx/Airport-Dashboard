//importing express router
const router = require('express').Router();

//importing AuthDB model
const {Application} = require('../model');

//importing logger
const serverlog = require('../logger');

router.get('/',(req,res,next)=>{
    if(req.headers.authorization && req.headers.authorization.split('')[0] == 'Basic'){
        const key = Buffer.from(req.headers.authorization.split(' ')[1],'base64').toString('ascii');
        Application.findOne({oauth_secret: key},(err,doc)=>{
            if(err){
                serverlog.error(`GateKeeper DATABASE ERROR -> ${err}`);
                res.status(500).send('error 500 internal server error');
            }
            else{
                if(doc){
                    serverlog.info(`GateKeeper Access allowed to App with title = ${doc.title}`);
                    next();
                }
                else{
                    serverlog.warn(`GateKeeper Access prevented from ${req.headers.host}/${req.headers.origin}`);
                    res.status(403).send('error 403 Forbidden');
                }
            }
        });
    }
    else{
        serverlog.warn(`GateKeeper NO AUTH HEADER OR INVALID AUTH TYPE from ${req.headers.host}/${req.headers.origin}`);
        res.status(401).send('error 401 Unauthorised');
    }
});

module.exports = router;