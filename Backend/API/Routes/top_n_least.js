//importing express
const express = require("express");
const router = express.Router();

//importing logger
const serverLog = require('../logger');

//importing chart option skeleton
const custom_group = require("../Meta/top_n_least.json");

//importing DB module
const db = require("../db");

//top_least chart route code
router.get("/:air/top_and_least/", (req, res) => {

  serverLog.info(`REQUESTED Top and Least chart with Airport=${req.params.air}, `+
                  `Date=${req.query.date}, `+
                  `Type=${req.query.type}`
                );

  db.getDB()
    .collection(req.params.air)
    .find({ date: req.query.date, type: req.query.type })
    .project({
      _id: 0,
      ["by_device.top"]: 1,
      ["by_device.least"]: 1,
      ["by_survey.top"]: 1,
      ["by_survey.least"]: 1,
      ["by_group.top"]: 1,
      ["by_group.least"]: 1,
    })
    .toArray((err, documents) => {
      {
        if (err){
          serverLog.error(`Top_Least chart DATABASE ERROR with Airport=${req.params.air}, `+
                          `Date=${req.query.date}, `+
                          `Type=${req.query.type} -> ${err}`
                         );
          res.status(400).send(err);
        }
        else if(Object.keys(documents).length==0){
          serverLog.warn(`Top_Least chart DATA NOT FOUND with Airport=${req.params.air}, `+
                          `Type=${req.query.type}, `+
                          `Date=${req.query.date}`
                         );
          res.status(404).send("404 data not found");               
        }  
        else {
          var topData = [];
          var leastData = [];
          var series = [];
          var categories = [];
          var topArea = [];
          var leastArea = [];

          topData.push(
            documents[0].by_device.top.exp,
            documents[0].by_survey.top.exp,
            documents[0].by_group.top.exp
          );
          leastData.push(
            documents[0].by_device.least.exp,
            documents[0].by_survey.least.exp,
            documents[0].by_group.least.exp
          );

          series.push(
            {
              name: "Top",
              data: topData,
            },
            {
              name: "Least",
              data: leastData,
            }
          );
          topArea.push(
            documents[0].by_device.top.area,
            documents[0].by_survey.top.area,
            documents[0].by_group.top.area
          );
          leastArea.push(
            documents[0].by_device.least.area,
            documents[0].by_survey.least.area,
            documents[0].by_group.least.area
          );
          for (let i = 0; i < 3; i++) {
            if (topData[i] < 10.0 || leastData[i] < 10.0) {
              custom_group.dataLabels.offsetX = 36;
              custom_group.dataLabels.style.colors = ["#FFF"];
              break;
            }
          }
          categories.push("By Device", "By Survey", "By Group");
          custom_group.series = series;
          custom_group.xaxis.categories = categories;
          //console.log(topData, leastData);

          res.status(200).render("chart_custom_group", {
            option: JSON.stringify(custom_group),
            area: JSON.stringify({ leastArea: leastArea, topArea: topArea }),
          });
        }
      }
    });
});

module.exports = router;
