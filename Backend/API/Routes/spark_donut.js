//importing express
const express = require("express");
const router = express.Router();

//importing logger
const serverLog = require("../logger");

//importing chart options skeleton
const spark_donut = require("../Meta/spark_donut.json");

//importing DB module
const db = require("../db");

//donut chart route code
router.get("/:air/spark_donut/:type", (req, res) => {
  const dates = req.query.date;
  const airport = req.params.air;
  serverLog.info(
    `REQUESTED Response  spark donut chart requested with Airport=${airport}, ` +
      `Type=${req.params.type}` +
      `Date=${dates}, `
  );

  db.getDB()
    .collection(airport)
    .find({ date: dates, type: req.params.type })
    .project({ _id: 0, ["general.all_responses"]: 1 })
    .toArray((err, documents) => {
      {
        if (err) {
          serverLog.error(
            `Spark Donut chart DATABASE ERROR with Airport=${airport}, ` +
              `Date=${dates}, ` +
              `Type=${req.params.type} -> ${err}`
          );
          res.status(500).send(err);
        } else if (Object.keys(documents).length == 0) {
          serverLog.warn(
            `Spark Donut chart DATA NOT FOUND with Airport=${airport}, ` +
              `Type=${req.params.type}, ` +
              `Date=${dates}`
          );
          res.status(404).send("404 data not found");
        } else {
          let data = [];
          data.push(documents[0].general.all_responses[0].Excellent);
          data.push(documents[0].general.all_responses[0].Good);
          data.push(documents[0].general.all_responses[0].Average);
          data.push(documents[0].general.all_responses[0].Poor);
          data.push(documents[0].general.all_responses[0].Bad);
          spark_donut.series = data;
          spark_donut.labels = ["Excellent", "Good", "Average", "Poor", "Bad"];

          res.status(200).render("spark_pie", {
            option: JSON.stringify(spark_donut),
          });
        }
      }
    });
});
module.exports = router;
