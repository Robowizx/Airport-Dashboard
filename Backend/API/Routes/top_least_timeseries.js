//importing express
const express = require("express");
const router = express.Router();

//importing logger
const serverLog = require("../logger");

//importing chart options skeleton
const { line, brush } = require("../Meta/top_n_least_timeseries.json");

//importing DB module
const db = require("../db");

//top_least_series chart route code
router.get("/:air/top_least_timeseries/:sec", (req, res) => {
  serverLog.info(
    `REQUESTED Top_Least time series chart with Airport=${req.params.air}, ` +
      `Section=${req.params.sec}, ` +
      `SDate=${req.query.sdate}, ` +
      `EDate=${req.query.edate}, ` +
      `Type=${req.query.type}`
  );

  db.getDB()
    .collection(req.params.air)
    .find({
      date: { $gte: req.query.sdate, $lte: req.query.edate },
      type: req.query.type,
    })
    .project({
      _id: 0,
      date: 1,
      [`${req.params.sec}.top`]: 1,
      [`${req.params.sec}.least`]: 1,
    })
    .toArray((err, documents) => {
      {
        if (err){
          serverLog.error(
            `Top_Least time series chart DATABASE ERROR with Airport=${req.params.air}, ` +
              `Section=${req.params.sec}, ` +
              `SDate=${req.query.sdate}, ` +
              `EDate=${req.query.edate}, ` +
              `Type=${req.query.type} -> ${err}`
          );
          res.status(400).send(err);
        }
        else if(Object.keys(documents).length==0){
          serverLog.warn(`Top_Least time series chart DATA NOT FOUND with Airport=${req.params.air}, `+
                          `Section=${req.params.sec}, `+
                          `Type=${req.query.type}, `+
                          `SDate=${req.query.sdate}, `+
                          `EDate=${req.query.edate}`
                         );
          res.status(404).send("404 data not found");               
        } 
        else{
          var topData = [];
          var leastData = [];
          var series = [];
          var seriesBrush = [];
          var topArea = [];
          var leastArea = [];
          documents.forEach((d) => {
            date = d.date;
            topArea.push(d[req.params.sec].top.area);
            leastArea.push(d[req.params.sec].least.area);
            topData.push([new Date(date).getTime(), d[req.params.sec].top.exp]);
            leastData.push([new Date(date).getTime(), d[req.params.sec].least.exp]);
          });
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
          seriesBrush.push(
            {
              name: "Top",
              data: topData,
            },
            {
              name: "Least",
              data: leastData,
            }
          );

          line.series = series;
          brush.series = seriesBrush;
          brush.chart.selection.xaxis.min = new Date(req.query.sdate);
          brush.chart.selection.xaxis.max = new Date(req.query.edate);

          // console.log(topData, leastData);
          // console.log(topArea, leastArea);
          res.status(200).render("chart_top_least_timeseries", {
            option1: JSON.stringify(line),
            option2: JSON.stringify(brush),
            area: JSON.stringify({ leastArea: leastArea, topArea: topArea }),
          });
        }
      }
    });
});

module.exports = router;
