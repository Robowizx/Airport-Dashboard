//importing express
const express = require('express');
const router = express.Router();

//importing logger
const serverLog = require('../logger');

//importing chart options skeleton
const group_column = require('../Meta/exp_imp_index.json');

//importing DB module
const db = require('../db');

//exp chart route code
router.get('/:air/exp/:sec',(req,res)=>{

    let db_query = { _id:0};
    db_query[`${req.params.sec}.responses`] = 1;
    serverLog.info(`REQUESTED Exp/Imp chart with Airport=${req.params.air}, `+
                   `Section=${req.params.sec}, `+
                   `Date=${req.query.date}, `+
                   `Type=${req.query.type}`
                  );

    db.getDB().collection(req.params.air).find({date: req.query.date, type: req.query.type}).project(db_query).toArray((err,documents)=>{
        if(err){
            serverLog.error(`Exp/Imp chart DATABASE ERROR with Airport=${req.params.air}, `+
                            `Section=${req.params.sec}, `+
                            `Date=${req.query.date}, `+
                            `Type=${req.query.type} -> ${err}`
                           );
            res.status(500).send(err);
        }
        else if(Object.keys(documents).length==0){
            serverLog.warn(`Exp/Imp chart DATA NOT FOUND with Airport=${req.params.air}, `+
                            `Section=${req.params.sec}, `+
                            `Type=${req.query.type}, `+
                            `EDate=${req.query.date}`
                           );
            res.status(404).send("404 data not found");               
          }    
        else{
            let expdata = [];
            let impdata = [];
            let area = [];
            let series = [];
            //console.log(documents[0][`${req.params.sec}`]);
            let resp = documents[0][`${req.params.sec}`].responses;

            for (i=0;i<resp.length;i+=2){
                // console.log(resp[i]);
                // console.log(resp[i]['Exp. Index']);
                expdata.push(resp[i]['Exp Index']);
                area.push(resp[i].area);
                if(req.params.sec == 'by_device'){
                    if(typeof(resp[i]['Improvement Index']) =='undefined')
                        impdata.push(0);
                    else
                        impdata.push(resp[i]['Improvement Index']);
                }
            }
            
            series.push({
                            name:'Exp Index',
                            data: expdata
                        });

            if(req.params.sec == 'by_device'){
            series.push({
                        name:'Improvement Index',
                        data: impdata
                        });        
            }

            group_column.series = series;
            group_column.xaxis.categories = area;
            // res.json(documents);
            // console.log(group_column);
            //console.log(impdata,expdata,area);

            res.status(200).render("chart_template",{option: JSON.stringify(group_column)});
        }
    })
});

module.exports = router;
