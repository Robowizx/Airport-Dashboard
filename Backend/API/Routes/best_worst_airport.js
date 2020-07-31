//importing express router
const router = require('express').Router();

//importing logger
const serverLog = require('../logger');

//importing DB module
const db = require('../db');

//importing chart options skeleton
const options = require('../Meta/top-least-guage.json');
const { min } = require('moment-timezone');

router.get('/airport/prog/:type',(req,res)=>{

    if(req.params.type !='maxExp' && req.params.type != 'minExp'){
        serverLog.warn(`BAD REQUEST of top-least-guage chart with Type=${req.params.type}`);
        res.status(500).send('500 Bad request');
    }
    else{
        serverLog.info(`Requested top-least-guage  chart with Airport=${req.params.air}, `+
                   `Type=${req.params.type}, `+
                   `Date=${req.query.date}`
                  );
                var col = []
                var counter = 0
                var minmax =[],name=[];
                          db.getDB().listCollections().toArray(function (err, collectionInfos) {
                              collectionInfos.forEach((data,dindex) => {
                                var total = 0;
                                db.getDB().collection(data.name).find({date: req.query.date}).project({ _id:0, type:1, 'general.avg_exp_index':1 }).toArray((err,documents)=>{
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        documents.forEach((exp,eindex)=>{
                                            let {general:{avg_exp_index}} = exp;
                                            total += avg_exp_index;
                                            const expDone = eindex >= documents.length - 1;
                                            const airDone = dindex >= collectionInfos.length - 1;
                                            if(airDone&&expDone){
                                                col.push([data.name,total/documents.length]);
                                                console.log(col);
                                                minmax.push(col[0][1]);
                                                col.forEach(element => {
                                                    if(req.params.type=='maxExp'){
                                                        if(element[1] > minmax){
                                                            minmax[0] = element[1];
                                                            name[0] = element[0];
                                                        }    
                                                    }
                                                    else{
                                                        if(element[1] < minmax){
                                                            minmax[0] = element[1];
                                                            name[0] = element[0];
                                                        }    
                                                    }
                                                });
                                                options.series=minmax;
                                                options.labels=name;
                            
                                                if(minmax > 66)
                                                    options.fill.colors = ["#99ff66"];
                                                else if(minmax > 33)
                                                    options.fill.colors = ["#ffff66"];
                                                else
                                                    options.fill.colors = ["#ff4d4d"];
                            
                                                if(req.params.type == 'maxExp')
                                                    options.title.text = "Best Airport Experience Index"; 
                                                else
                                                    options.title.text = "Worst Airport Experience Index";
                            
                                                res.status(200).render('radial_template',{option: JSON.stringify(options)});
                                            }
                                        })
                                        console.log(data.name,total/documents.length);
                                        col.push([data.name,total/documents.length]);

                                    }
                                });
                            });
                        });
    }           
});

module.exports = router;