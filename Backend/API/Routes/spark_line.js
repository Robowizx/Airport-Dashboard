//importing express
const express = require("express");
const router = express.Router();

//importing logger
const serverLog = require("../logger");

//importing chart options skeleton
const spark_line = require("../Meta/spark_line.json");

//importing DB module
const db = require("../db");

//importing moment for date computation
const moment = require("moment-timezone");

//top_least_series chart route code
router.get("/:air/spark_line/:type", (req, res) => {
  serverLog.info(
    `REQUESTED Spark Line series chart with Airport=${req.params.air}, ` +
      `Type=${req.params.type},` +
      `SDate=${req.query.sdate},` +
      `EDate=${req.query.edate}, `
  );

  db.getDB()
    .collection(req.params.air)
    .find({
      date: { $gte: req.query.sdate, $lte: req.query.edate },
      type: req.params.type,
    })
    .project({
      _id: 0,
      date: 1,
      ["general.all_responses"]: 1,
    })
    .toArray((err, documents) => {
      {
        if (err) {
          serverLog.error(
            `Spark line series chart DATABASE ERROR with Airport=${req.params.air}, ` +
              `Type=${req.params.type},` +
              `SDate=${req.query.sdate}, ` +
              `EDate=${req.query.edate}, -> ${err}`
          );
          res.status(400).send(err);
        } else if (Object.keys(documents).length == 0) {
          serverLog.warn(
            `Spark Line series chart DATA NOT FOUND with Airport=${req.params.air}, ` +
              `Type=${req.params.type}, ` +
              `SDate=${req.query.sdate}, ` +
              `EDate=${req.query.edate}`
          );
          res.status(404).send("404 data not found");
        } else {
          var exp_index = [];
          var series = [];
          documents.forEach((d) => {
            date = moment(d.date).add(1, "d");
            exp_index.push([
              new Date(date).getTime(),
              d.general.all_responses[0]["Exp Index"],
            ]);
          });
          series.push({
            data: exp_index,
          });
          spark_line.series = series;

          res.status(200).render("chart_spark_line", {
            option: JSON.stringify(spark_line),
          });
        }
      }
    });
});

module.exports = router;
