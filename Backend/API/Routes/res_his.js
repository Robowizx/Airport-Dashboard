//importing express
const express = require("express");
const router = express.Router();

//importing logger
const serverLog = require('../logger');

//importing chart options skeleton
const dynamic_column  = require("../Meta/res_his.json");

//importing DB module
const db = require("../db");

//res_his chart route code
router.get("/:air/resh/:type", (req, res) => {
  const type = req.params.type +".responses";
  serverLog.info(`REQUESTED Response histogram chart with Airport=${req.params.air}, `+
                 `Section=${req.params.type}, `+
                 `Date=${req.query.date}, `+
                 `Type=${req.query.dev}`
                );

  db.getDB()
    .collection(req.params.air)
    .find({ date: req.query.date, type: req.query.type })
    .project({ _id: 0, [type]: 1 })
    .toArray((err, documents) => {
      if (err){
        serverLog.error(`Response histogram chart DATABASE ERROR with Airport=${req.params.air},`+
                 `Section=${req.params.type}, `+
                 `Date=${req.query.date}, `+
                 `Type=${req.query.dev} -> ${err}`
                );
        res.status(400).send(err);
      }
      else if(Object.keys(documents).length==0){
        console.log(documents);
        serverLog.warn(`Response hitogram chart DATA NOT FOUND with Airport=${req.params.air}, `+
                        `Section=${req.params.type}, `+
                        `Type=${req.query.dev}, `+
                        `Date=${req.query.date}`
                       );
        res.status(404).send("404 data not found");               
      }  
      else {
        var resp;
        if (type === "by_device.responses") {
          resp = documents[0].by_device.responses;
          dynamic_column.title.text = "Responses By Device";
        }
        if (type === "by_survey.responses") {
          resp = documents[0].by_survey.responses;
          dynamic_column.title.text = "Responses By Survey";
        }
        if (type === "by_group.responses") {
          resp = documents[0].by_group.responses;
          dynamic_column.title.text = "Responses By Group";
        }

        var bad = [];
        var poor = [];
        var average = [];
        var good = [];
        var excellent = [];
        var area = [];
        var series = [];
        for (i = 0; i < resp.length; i += 2) {
          bad.push(resp[i]["Bad"]);
          poor.push(resp[i]["Poor"]);
          average.push(resp[i]["Average"]);
          good.push(resp[i]["Good"]);
          excellent.push(resp[i]["Excellent"]);
          area.push(resp[i].area);
        }
        series.push(
          {
            name: "Bad",
            data: bad,
          },
          {
            name: "Poor",
            data: poor,
          },
          {
            name: "Average",
            data: average,
          },
          {
            name: "Good",
            data: good,
          },
          {
            name: "Excellent",
            data: excellent,
          }
        );
        dynamic_column.series = series;
        dynamic_column.xaxis.categories = area;
        res.status(200).render("chart_template", {
          option: JSON.stringify(dynamic_column),
        });
      }
    });
});

module.exports = router;
