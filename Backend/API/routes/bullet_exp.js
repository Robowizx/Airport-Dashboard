const express = require('express');
const router = express.Router();
const db = require('../db');
const {bullet} = require('../chart_metadata.json');

router.get('/:air/:dev/exp',(req,res)=>{

    let db_query = { _id:0,general:1 };
    bullet.ranges=[];
    bullet.markers = [];
    bullet.measures = [];
    db.getDB().collection(req.params.air).find({date: req.query.date,type: req.params.dev}).project(db_query).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{

            // console.log(documents);
            bullet.title = "Exp. Index";
            bullet.subtitle = "Exp. till date vs Exp."
            bullet.ranges.push(100);
            bullet.markers.push(documents[0].general.avg_exp_index);
            bullet.measures.push(documents[0].general.all_responses[0]['Exp Index']);
            console.log(bullet);

            res.render("bullet_chart",{option: JSON.stringify(bullet)});
        }
    })
});

module.exports = router;