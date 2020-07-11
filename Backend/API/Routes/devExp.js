//importing express router
const router = require('express').Router();

//importing logger
const serverLog = require('../logger');

//importing DB module
const db = require('../db');

//importing chart options skeleton
const options = require('../Meta/devExp.json');

router.get('/:air/devExp',(req,res)=>{
    serverLog.info(`Requested DevExp chart with Airport=${req.params.air}, `+
                   `Date=${req.query.date}`
                  );
    db.getDB()
      .collection(req.params.air)
      .find({ date: req.query.date })
      .project({ _id:0, type:1, 'general.avg_exp_index':1 })
      .toArray((err,documents)=>{
            if(err){
                serverLog.error(`DevExp chart DATABASE ERROR with Airport=${req.params.air}, `+
                                `Date=${req.query.date} -> ${err}`
                               );
                res.status(500).send(err);               
            }
            else if(Object.keys(documents).length==0){
                serverLog.warn(`DevExp chart DATA NOT FOUND with Airport=${req.params.air}, `+
                                `Date=${req.query.date}`
                               );
                res.status(404).send('404 DATA NOT FOUND');
            }
            else{
                let data=[],names=[];

                documents.forEach(element => {
                    data.push(element.general.avg_exp_index);
                    names.push(element.type);
                });

                options.series[0].data = data;
                options.xaxis.categories = names;

                res.status(200).render('dev_exp_template',{option: JSON.stringify(options)});
            }
      });           
});

module.exports = router;