//importing express
const express = require("express");
const router = express.Router();

//importing logger
const serverLog = require('../logger');

//importing chart options skeleton
const donut  = require("../Meta/donut.json");

//importing DB module
const db = require("../db");

//donut chart route code
router.get("/:air/res_donut/", (req, res) => {

  const dates = req.query.date;
  const airport = req.params.air;
  serverLog.info(`REQUESTED Response donut chart requested with Airport=${airport}, `+
                 `Date=${dates}, `+
                 `Type=${req.query.type}`
                );

  db.getDB()
    .collection(airport)
    .find({ date: dates, type: req.query.type})
    .project({_id: 0, ["general.all_responses"]:1})
    .toArray((err, documents) => {
      {
        if (err){
          serverLog.error(`Donut chart DATABASE ERROR with Airport=${airport}, `+
                          `Date=${dates}, `+
                          `Type=${req.query.type} -> ${err}`
                         );
          res.status(400).send(err);
        }  
        else {
          donut.series.push(documents[0].general.all_responses[0].Excellent);
          donut.series.push(documents[0].general.all_responses[0].Good);
          donut.series.push(documents[0].general.all_responses[0].Average);
          donut.series.push(documents[0].general.all_responses[0].Poor);
          donut.series.push(documents[0].general.all_responses[0].Bad);
          donut.labels = ["Excellent", "Good", "Average", "Poor", "Bad"];

          res.status(200).render("chart_template", {
            option: JSON.stringify(donut),
          });
        }
      }
    });
});
module.exports = router;
