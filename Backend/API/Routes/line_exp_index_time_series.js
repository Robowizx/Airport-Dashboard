//importing express
const express = require('express');
const router = express.Router();

//importing logger
const serverLog = require('../logger');

//importing chart options skeleton
const {line_chart} = require('../Meta/line_exp_index_time_series.json');

//importing DB module
const db = require('../db');

//exp time series chart route code
router.get('/:air/exp_series/:sec',(req,res)=>{
    serverLog.info(`REQUESTED Top_Least time series chart with Airport=${req.params.air}, `+
                 `Section=${req.params.sec}, `+
                 `SDate=${req.query.sdate}, `+
                 `EDate=${req.query.edate}, `+
                 `Type=${req.query.type}`
                );


    let db_query = { _id:0,date:1};
    db_query[`${req.params.sec}.responses`] = 1;
    
    db.getDB().collection(req.params.air).find({date: {$gte:req.query.sdate,$lt:req.query.edate}, type: req.query.type}).project(db_query).toArray((err,documents)=>{
        if(err){
                serverLog.error(`Exp time series chart DATABASE ERROR with Airport=${req.params.air}, `+
                 `Section=${req.params.sec}, `+
                 `SDate=${req.query.sdate}, `+
                 `EDate=${req.query.edate}, `+
                 `Type=${req.query.type} -> ${err}`
                );
                res.status(500).send(err);
        }
        else if(Object.keys(documents).length==0){
            serverLog.warn(`Exp time series chart DATA NOT FOUND with Airport=${req.params.air}, `+
                            `Section=${req.params.sec}, `+
                            `Type=${req.query.type}, `+
                            `SDate=${req.query.sdate}, `+
                            `EDate=${req.query.edate}`
                           );
            res.status(404).send("404 data not found");               
        }
        else{

            console.log(documents[0][`${req.params.sec}`]);
            let area = [];
            let series = [];
             var seriesBrush = [];
            documents.forEach(d=>{
               
                let resp = d[`${req.params.sec}`].responses;
                
                for(i=0;i<resp.length;i+=2){  
                
                if(!area.includes(resp[i].area)){
                   
                    area.push(resp[i].area);
                    series.push(
                              {
                                  name:resp[i].area,
                                  data:[[new Date(d.date).getTime(),resp[i]['Exp Index']]]
                              });
                  
                   }
                           
                else{
                                
                    let x = series.findIndex(x => x.name === resp[i].area);
                    series[x].data.push([new Date(d.date).getTime(),resp[i]['Exp Index']]);
                    
                                
                    }
                
                
                  }
            
             })
          
         res.status(200).render("chart_exp_timeseries",{option: JSON.stringify(line_chart),series: JSON.stringify(series), area: JSON.stringify(area)});                                    
        }
    })
});

module.exports = router;

