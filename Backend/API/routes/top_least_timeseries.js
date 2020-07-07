const express = require("express");
const router = express.Router();
const { line, brush } = require("../chart_metadata.json");
const db = require("../db");
const moment = require("moment");

router.get("/:air/top_least_timeseries/:sec", (req, res) => {
  console.log("please wait its connecting...");
  db.getDB()
    .collection(req.params.air)
    .find({
      date: { $gte: req.query.sdate, $lte: req.query.edate },
      type: req.query.type,
    })
    .project({ _id: 0, date: 1, [`${req.params.sec}.top`]: 1, [`${req.params.sec}.least`]: 1 })
    .toArray((err, documents) => {
      {
        if (err) console.log(err);
        else {
          var topData = [];
          var leastData = [];
          var series = [];
          var seriesBrush = [];
          var topArea = [];
          var leastArea = [];
          documents.forEach((d) => {
            date = d.date;
            topArea.push(d.by_device.top.area);
            leastArea.push(d.by_device.least.area);
            topData.push([new Date(date).getTime(),d.by_device.top.exp]);
            leastData.push([new Date(date).getTime(),d.by_device.least.exp]);
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
          brush.chart.selection.xaxis.min = moment(req.query.sdate).format(
            "DD MMM YYYY"
          );
          brush.chart.selection.xaxis.max = moment(req.query.edate).format(
            "DD MMM YYYY"
          );
          brush.series = seriesBrush;
          console.log(topData, leastData);
          console.log(topArea, leastArea);
          res.render("chart_top_least_timeseries", {
            option1: JSON.stringify(line),
            option2: JSON.stringify(brush),
            area: JSON.stringify({ leastArea: leastArea, topArea: topArea })
          });
        }
      }
    });
});

module.exports = router;
