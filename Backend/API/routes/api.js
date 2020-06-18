const express = require('express');
const router = express.Router();
const pug = require('pug');
const {column_chart} = require('../chart_metadata.json');
const db = require('../db');

data = column_chart;

router.get('/grouped_col/',(req,res)=>{
    const dates = req.query.date
    db.getDB().collection("Agartala").find({date:dates}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            console.log(documents);
            // res.json(documents);
            console.log(req.query.date);
            res.render("chart_template",{option: JSON.stringify(data)})
        }
    })

})
module.exports = router;
