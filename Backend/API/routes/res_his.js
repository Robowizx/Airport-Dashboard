const express = require("express");
const router = express.Router();
const { dynamic_column } = require("../chart_metadata.json");
const db = require("../db");

router.get("/:air/resh/:type", (req, res) => {
  const dates = req.query.date;
  const airport = req.params.air;
  const type = req.params.type +".responses";

  db.getDB()
    .collection(airport)
    .find({ date: dates })
    .project({ _id: 0, [type]: 1 })
    .toArray((err, documents) => {
      if (err) console.log(err);
      else {
        var resp;
        if (type === "by_device.responses"){
          resp = documents[0].by_device.responses
          dynamic_column.title.text = "Responses By Device";
        }
        if (type === "by_survey.responses"){
          resp = documents[0].by_survey.responses
          dynamic_column.title.text = "Responses By Survey";
        }
        if (type === "by_group.responses"){
          resp = documents[0].by_group.responses
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
        res.render("chart_template", {
          option: JSON.stringify(dynamic_column),
        });
      }
    });
});

module.exports = router;