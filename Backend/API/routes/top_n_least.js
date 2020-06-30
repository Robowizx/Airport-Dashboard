const express = require("express");
const router = express.Router();
const pug = require("pug");
const { custom_group } = require("../chart_metadata.json");
const db = require("../db");

router.get("/:air/:type/:top_and_least/", (req, res) => {
  const dates = req.query.date;
  const airport = req.params.air;
  const type = req.params.type;

  console.log('finiding');
  db.getDB()
    .collection(airport)
    .find({ date: dates, type: type })
    .project({
      _id: 0,
      ["by_device.top"]: 1,
      ["by_device.least"]: 1,
      ["by_survey.top"]: 1,
      ["by_survey.least"]: 1,
      ["by_group.top"]: 1,
      ["by_group.least"]: 1,
    })
    .toArray((err, documents) => {
      {
        if (err) console.log(err);
        else {
          var topData = [];
          var leastData = [];
          var series = [];
          var categories = [];
          var topArea = [];
          var leastArea = [];

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
              name: "Top",
              data: topData,
            },
            {
              name: "Least",
              data: leastData,
            }
          );
          topArea.push(
            documents[0].by_device.top.area,
            documents[0].by_survey.top.area,
            documents[0].by_group.top.area
          );
          leastArea.push(
            documents[0].by_device.least.area,
            documents[0].by_survey.least.area,
            documents[0].by_group.least.area
          );
          for(let i=0;i<3;i++){
            if(topData[i]<10 || leastData[i]<10){
              custom_group.dataLabels.offsetX = 40;
            }
          }
          categories.push("By Device", "By Survey", "By Group");
          custom_group.series = series;
          custom_group.xaxis.categories = categories;
          // custom_group.plotOptions.bar.dataLabels.labels = ["Top", "Least"];
          console.log(topData, leastData);
          // res.render("chart_custom_group", {
          //   topArea: topArea,
          //   leastArea: leastArea,
          //   topData: topData,
          //   leastData: leastData,
          // });
          res.render("chart_custom_group", {
            option: JSON.stringify(custom_group),
            area: JSON.stringify({ leastArea: leastArea, topArea: topArea })
          });
        }
      }
    });
});

module.exports = router;
