//importing express router
const router = require('express').Router();

//importing logger
const serverLog = require('../logger');

//importing DB module
const db = require('../db');

//importing chart options skeleton
const options = require('../Meta/top-least-guage.json');
const { min } = require('moment-timezone');

router.get('/:air/guage/:type',(req,res)=>{

    if(req.params.type !='maxExp' && req.params.type != 'minExp'){
        serverLog.warn(`BAD REQUEST of top-least-guage chart with Type=${req.params.type}`);
        res.status(500).send('500 Bad request');
    }
    else{
        serverLog.info(`Requested top-least-guage  chart with Airport=${req.params.air}, `+
                   `Type=${req.params.type}, `+
                   `Date=${req.query.date}`
                  );
        db.getDB()
          .collection(req.params.air)
          .find({ date: req.query.date })
          .project({ _id:0, type:1, 'general.avg_exp_index':1 })
          .toArray((err,documents)=>{
                if(err){
                    serverLog.error(`top-least-guage chart DATABASE ERROR with Airport=${req.params.air}, `+
                                    `Type=${req.params.type}, `+
                                    `Date=${req.query.date} -> ${err}`
                                   );
                    res.status(500).send(err);               
                }
                else if(Object.keys(documents).length==0){
                    serverLog.warn(`top-least-guage chart DATA NOT FOUND with Airport=${req.params.air}, `+
                                   `Type=${req.params.type}, `+
                                   `Date=${req.query.date}`
                                   );
                    res.status(404).send('404 DATA NOT FOUND');
                }
                else{
                    let minmax =[],name=[documents[0].type];
                    minmax.push(documents[0].general.avg_exp_index);
                    documents.forEach(element => {
                        if(req.params.type=='maxExp'){
                            if(element.general.avg_exp_index > minmax){
                                minmax[0] = element.general.avg_exp_index;
                                name[0] = element.type;
                            }    
                        }
                        else{
                            if(element.general.avg_exp_index < minmax){
                                minmax[0] = element.general.avg_exp_index;
                                name[0] = element.type;
                            }    
                        }
                    });

                    options.series=minmax;
                    options.labels=name;

                    if(minmax > 66)
                        options.fill.colors = ["#A7E509"];
                    else if(minmax > 33)
                        options.fill.colors = ["#FFFF00"];
                    else
                        options.fill.colors = ["#ff6150"];

                    if(req.params.type == 'maxExp')
                        options.title.text = "Top Facility Exp Index"; 
                    else
                        options.title.text = "Least Facility Exp Index";

                    res.status(200).render('radial_template',{option: JSON.stringify(options)});
                }
          });
    }           
});

module.exports = router;