//importing express
const router = require("express").Router();

//importing logger
const serverLog = require('../logger');

//importing chart options skeleton
const donut  = require("../Meta/donut.json");

//importing DB module
const db = require("../db");

//donut chart route code
router.get("/:air/res_donut", (req, res) => {

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
          res.status(500).send(err);
        }
        else if(Object.keys(documents).length==0){
          serverLog.warn(`Donut chart DATA NOT FOUND with Airport=${airport}, `+
                          `Type=${req.query.type}, `+
                          `Date=${dates}`
                         );
          res.status(404).send("404 data not found");               
        }  
        else {
          let data = [];
          data.push(documents[0].general.all_responses[0].Excellent);
          data.push(documents[0].general.all_responses[0].Good);
          data.push(documents[0].general.all_responses[0].Average);
          data.push(documents[0].general.all_responses[0].Poor);
          data.push(documents[0].general.all_responses[0].Bad);
          donut.series = data;
          donut.labels = ["Excellent", "Good", "Average", "Poor", "Bad"];

          res.status(200).render("chart_template", {
            option: JSON.stringify(donut),
          });
        }
      }
    });
});
module.exports = router;
