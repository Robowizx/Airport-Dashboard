const express = require('express');
const router = express.Router();
const {group_column} = require('../chart_metadata.json');
const db = require('../db');

router.get('/:air/exp/:sec',(req,res)=>{

    let db_query = { _id:0};
    db_query[`${req.params.sec}.responses`] = 1;
    console.log(db_query)
    let expdata=[];
    let impdata = [];
    let area = [];
    let series = [];
    db.getDB().collection(req.params.air).find({date: req.query.date}).project(db_query).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{

            console.log(documents);
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
                            name:'Exp. Index',
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
            console.log(impdata,expdata,area);

            res.render("chart_template",{option: JSON.stringify(group_column)});
        }
    })
});

module.exports = router;