
// const serverLog = require//importing express
const express = require('express');
const router = express.Router();

//importing logger
const serverLog = require('../logger');

//importing chart options skeleton
const {heatmap} = require('../Meta/heatmap.json');

//importing DB module
const db = require('../db');

//importing moment for date computation
const moment = require("moment-timezone");
const { max, min } = require('moment-timezone');

//exp time series chart route code
router.get('/:air/total_resp',(req,res)=>{
    serverLog.info(`REQUESTED Heat map series chart with Airport=${req.params.air}, `+
                 `Section=${req.params.sec}, `+
                 `SDate=${req.query.sdate}, `+
                 `EDate=${req.query.edate}`
                );


    let db_query = { _id:0,date:1, type:1, 'general.all_responses.Total Responses':1 };
    
    db.getDB().collection(req.params.air).find({date: {$gte:req.query.sdate,$lt:req.query.edate}}).project(db_query).toArray((err,documents)=>{
        if(err){
                serverLog.error(`Heat map series chart DATABASE ERROR with Airport=${req.params.air}, `+
                 `Section=${req.params.sec}, `+
                 `SDate=${req.query.sdate}, `+
                 `EDate=${req.query.edate}-> ${err}`
                );
                res.status(500).send(err);
        }
        else if(Object.keys(documents).length==0){
            serverLog.warn(`Heat Map series chart DATA NOT FOUND with Airport=${req.params.air}, `+
                            `Section=${req.params.sec}, `+
                            `SDate=${req.query.sdate}, `+
                            `EDate=${req.query.edate}`
                           );
            res.status(404).send("404 data not found");               
        }
        else{

            // console.log(documents);
            let resdata = [];
            let series = [];
            let dev = [];
            documents.forEach(d=>{
                date = moment(d.date).add(1, 'd');
                // date = moment(d.date).format('DD MMM YYYY');
                // resdata.push([new Date(date).getTime(),d.general.all_responses[0]['Total Responses']]);
              
                if(!dev.includes(d.type)){
                   
                    dev.push(d.type);
                    series.push(
                              {
                                  name:d.type,
                                  data:[[new Date(d.date).getTime(),d.general.all_responses[0]['Total Responses']]]
                              });
                  
                   }
                           
                else{
                                
                    let x = series.findIndex(x => x.name === d.type);
                    series[x].data.push([new Date(d.date).getTime(),d.general.all_responses[0]['Total Responses']]);
                    
                    }
             })
            
            heatmap.series = series;  
        res.status(200).render("chart_template",{option: JSON.stringify(heatmap)});                                    
        }
    })
});

module.exports = router;
