//importing express
const express = require("express");
const router = express.Router();

//importing chart options skeleton
const { allRes_TS } = require("../Meta/allRes_TS.json");

//importing DB module
const db = require("../db");

//importing moment for date computation
const moment = require("moment-timezone");

//importing logger
const serverLog = require('../logger');

//all responses time series chart route code
router.get("/:air/allRes_TS/", (req, res) => {
  const airport = req.params.air;
  serverLog.info(`Requested all responses time series chart with Airport=${airport}, `+
                 `Type=${req.query.type}, `+
                 `SDate=${req.query.sdate}, `+
                 `EDate=${req.query.edate}`
                );

  db.getDB()
    .collection(airport)
    .find({
      date: { $gte: req.query.sdate, $lte: req.query.edate },
      type: req.query.type,
    })
    .project({ _id: 0, date: 1, ["general.all_responses"]: 1 })
    .toArray((err, documents) => {
      {
        if (err){
          serverLog.error(`all responses time series chart DATABASE ERROR with Airport=${airport}, `+
                        `Type=${req.query.type}, `+
                        `SDate=${req.query.sdate}, `+
                        `EDate=${req.query.edate} -> ${err}`
                       );
          res.status(500).send(err);
        }
        else if(Object.keys(documents).length==0){
          serverLog.warn(`all responses time series chart DATA NOT FOUND with Airport=${airport}, `+
                          `Type=${req.query.type}, `+
                          `SDate=${req.query.sdate}, `+
                          `EDate=${req.query.edate}`
                         );
          res.status(404).send("404 data not found");               
        }
        else {
          var series = [];
          var Excellent = [];
          var Good = [];
          var Average = [];
          var Poor = [];
          var Bad = [];
          
          documents.forEach((d) => {
            Excellent.push([new Date(d.date).getTime(),d.general.all_responses[0].Excellent]);
            Good.push([new Date(d.date).getTime(),d.general.all_responses[0].Good]);
            Average.push([new Date(d.date).getTime(),d.general.all_responses[0].Average]);
            Poor.push([new Date(d.date).getTime(),d.general.all_responses[0].Poor]);
            Bad.push([new Date(d.date).getTime(),d.general.all_responses[0].Bad]);
          });

          series.push(
            {
              name: "Excellent",
              data: Excellent,
            },
            {
              name: "Good",
              data: Good,
            },
            {
              name: "Average",
              data: Average,
            },
            {
              name: "Poor",
              data: Poor,
            },
            {
              name: "Bad",
              data: Bad,
            }
          );
          allRes_TS.series = series;
          //   allRes_TS.labels = ["Excellent", "Good", "Average", "Poor", "Bad"];
          //allRes_TS.yaxis.min = min(documents[0].general.all_responses[0]);
          //allRes_TS.yaxis.max = max(documents[0].general.all_responses[0]);

          res.status(200).render("chart_template", {
            option: JSON.stringify(allRes_TS),
          });
        }
      }
    });
});
module.exports = router;

//  example as shown (http://localhost:4000/Bhopal/allRes_TS/?sdate=2020-03-04&edate=2020-04-04&type=EI) in browser
