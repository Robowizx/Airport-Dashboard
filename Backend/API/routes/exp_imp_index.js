const express = require('express');
const router = express.Router();
const pug = require('pug');
const {group_column} = require('../chart_metadata.json');
const db = require('../db');

router.get('/:air/exp/by_device',(req,res)=>{
    const dates = req.query.date;
    const airport = req.params.air;
    db.getDB().collection(airport).find({date:dates}).project({_id:0,"by_device.responses":1}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            // console.log(documents);
            var resp = documents[0].by_device.responses;
            var expdata=[];
            var impdata = [];
            var area = [];
            var series = []
            for (i=0;i<resp.length;i+=2){
                // console.log(resp[i]);
                // console.log(resp[i]['Exp. Index']);
                if(typeof(resp[i]['Improvement Index']) =='undefined'){
                    impdata.push(0);
                }
                else{
                    impdata.push(resp[i]['Improvement Index']);
                }
                expdata.push(resp[i]['Exp. Index']);
                area.push(resp[i].area);
            }
            
            series.push(
                        {
                            name:'Exp. Index',
                            data: expdata
                        },
                        {
                            name:'Improvement Index',
                            data: impdata
                        }
            );
            group_column.series = series;
            group_column.xaxis.categories = area;
            // res.json(documents);
            // console.log(group_column);
            console.log(impdata,expdata,area);

            res.render("chart_template",{option: JSON.stringify(group_column)});
        }
    })
});

router.get('/:air/exp/by_survey',(req,res)=>{
    const dates = req.query.date;
    const airport = req.params.air;
    db.getDB().collection(airport).find({date:dates}).project({_id:0,"by_survey.responses":1}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            // console.log(documents);
            var resp = documents[0].by_survey.responses;
            var expdata=[];
            var area = [];
            var series = []
            for (i=0;i<resp.length;i+=2){
                // console.log(resp[i]);
                // console.log(resp[i]['Exp. Index']);
                expdata.push(resp[i]['Exp. Index']);
                area.push(resp[i].area);
            }
            
            series.push(
                        {
                            name:'Exp. Index',
                            data: expdata
                        }
            );
            group_column.series = series;
            group_column.xaxis.categories = area;
            // res.json(documents);
            // console.log(group_column);
            console.log(expdata,area);

            res.render("chart_template",{option: JSON.stringify(group_column)});
        }
    })
});

router.get('/:air/exp/by_group',(req,res)=>{
    const dates = req.query.date;
    const airport = req.params.air;
    db.getDB().collection(airport).find({date:dates}).project({_id:0,"by_group.responses":1}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            // console.log(documents);
            var resp = documents[0].by_group.responses;
            var expdata=[];
            var area = [];
            var series = []
            for (i=0;i<resp.length;i+=2){
                // console.log(resp[i]);
                // console.log(resp[i]['Exp. Index']);
                expdata.push(resp[i]['Exp. Index']);
                area.push(resp[i].area);
            }
            
            series.push(
                        {
                            name:'Exp. Index',
                            data: expdata
                        }
            );
            group_column.series = series;
            group_column.xaxis.categories = area;
            // res.json(documents);
            // console.log(group_column);
            console.log(expdata,area);

            res.render("chart_template",{option: JSON.stringify(group_column)});
        }
    })
});

module.exports = router;
