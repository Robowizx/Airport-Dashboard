// const serverLog = require//importing express
const express = require("express");
const router = express.Router();

//importing logger
const serverLog = require("../logger");

//importing chart options skeleton
const { line_chart } = require("../Meta/line_exp_index_time_series.json");

//importing DB module
const db = require("../db");

//exp time series chart route code
router.get("/:air/exp_till_date", (req, res) => {
  serverLog.info(
    `REQUESTED Top_Least time series chart with Airport=${req.params.air}, ` +
      `Section=${req.params.sec}, ` +
      `SDate=${req.query.sdate}, ` +
      `EDate=${req.query.edate}, ` +
      `Type=${req.query.type}`
  );

  let db_query = {
    _id: 0,
    date: 1,
    "general.avg_exp_index": 1,
    "general.avg_imp_index": 1,
  };

  db.getDB()
    .collection(req.params.air)
    .find({
      date: { $gte: req.query.sdate, $lt: req.query.edate },
      type: req.query.type,
    })
    .project(db_query)
    .toArray((err, documents) => {
      if (err) {
        serverLog.error(
          `Exp time series chart DATABASE ERROR with Airport=${req.params.air}, ` +
            `Section=${req.params.sec}, ` +
            `SDate=${req.query.sdate}, ` +
            `EDate=${req.query.edate}, ` +
            `Type=${req.query.type} -> ${err}`
        );
        res.status(500).send(err);
      } else if (Object.keys(documents).length == 0) {
        serverLog.warn(
          `Exp time series chart DATA NOT FOUND with Airport=${req.params.air}, ` +
            `Section=${req.params.sec}, ` +
            `Type=${req.query.type}, ` +
            `SDate=${req.query.sdate}, ` +
            `EDate=${req.query.edate}`
        );
        res.status(404).send("404 data not found");
      } else {
        console.log(documents[0]);
        let expdata = [];
        let impdata = [];
        let series = [];
        documents.forEach((d) => {
          expdata.push([new Date(d.date).getTime(), d.general.avg_exp_index]);
          impdata.push([new Date(d.date).getTime(), d.general.avg_imp_index]);
        });
        series.push({
          name: "Exp Index Till Date",
          data: expdata,
        });
        series.push({
          name: "Imp Index Till Date",
          data: impdata,
        });

        line_chart.series = series;
        res
          .status(200)
          .render("chart_template", { option: JSON.stringify(line_chart) });
      }
    });
});

module.exports = router;
