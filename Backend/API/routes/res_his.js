const express = require("express");
const router = express.Router();
const { dynamic_column } = require("../chart_metadata.json");
const db = require("../db");

router.get("/:air/res/by_device", (req, res) => {
  const dates = req.query.date;
  const airport = req.params.air;
  db.getDB()
    .collection(airport)
    .find({ date: dates })
    .project({ _id: 0, "by_device.responses": 1 })
    .toArray((err, documents) => {
      if (err) console.log(err);
      else {
        var resp = documents[0].by_device.responses;
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
        dynamic_column.title.text = "Responses By Device";
        res.render("chart_template", {
          option: JSON.stringify(dynamic_column),
        });
      }
    });
});

router.get("/:air/res/by_survey", (req, res) => {
  const dates = req.query.date;
  const airport = req.params.air;
  db.getDB()
    .collection(airport)
    .find({ date: dates })
    .project({ _id: 0, "by_survey.responses": 1 })
    .toArray((err, documents) => {
      if (err) console.log(err);
      else {
        var resp = documents[0].by_survey.responses;
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
        dynamic_column.title.text = "Responses By Survey";
        res.render("chart_template", {
          option: JSON.stringify(dynamic_column),
        });
      }
    });
});

router.get("/:air/res/by_group", (req, res) => {
  const dates = req.query.date;
  const airport = req.params.air;
  db.getDB()
    .collection(airport)
    .find({ date: dates })
    .project({ _id: 0, "by_group.responses": 1 })
    .toArray((err, documents) => {
      if (err) console.log(err);
      else {
        var resp = documents[0].by_group.responses;
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
        dynamic_column.title.text = "Responses By Group";
        res.render("chart_template", {
          option: JSON.stringify(dynamic_column),
        });
      }
    });
});

module.exports = router;