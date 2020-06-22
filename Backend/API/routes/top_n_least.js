const express = require("express");
const router = express.Router();
const pug = require("pug");
const { stacked_column } = require("../chart_metadata.json");
const db = require("../db");

// sc = stacked_column;

router.get("/:air/top_and_least/", (req, res) => {
  const dates = req.query.date;
  const airport = req.params.air;

  db.getDB()
    .collection(airport)
    .find(
      { date: dates },
      { projection: { by_device: 1, by_survey: 1, by_group: 1 } }
    )
    .toArray((err, documents) => {
      {
        if (err) console.log(err);
        else {
          var topData = [];
          var leastData = [];
          var series = [];
          var categories = [];

          topData.push(
            documents[0].by_device.top.exp,
            documents[0].by_survey.top.exp,
            documents[0].by_group.top.exp
          );
          leastData.push(
            documents[0].by_device.least.exp,
            documents[0].by_survey.least.exp,
            documents[0].by_group.least.exp
          );

          series.push(
            {
              name: "Top EI Device",
              data: topData,
            },
            {
              name: "Least EI Device",
              data: leastData,
            }
          );
          categories.push("By Device", "By Survey", "By Group");
          stacked_column.series = series;
          stacked_column.xaxis.categories = categories;
          console.log(topData);
          res.render("chart_template", {
            option: JSON.stringify(stacked_column),
          });
        }
      }
    });
});

module.exports = router;
