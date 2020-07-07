//importing express
const express = require("express");
const router = express.Router();

//importing chart options skeleton
const { allRes_TS } = require("../Meta/allRes_TS.json");

//importing DB module
const db = require("../db");

//importing moment for date computation
const moment = require("moment");

//all responses time series chart route code
const { min, max } = require("lodash");
router.get("/:air/allRes_TS/", (req, res) => {
  console.log("please wait its connecting...");
  const airport = req.params.air;
  db.getDB()
    .collection(airport)
    .find({
      date: { $gte: req.query.sdate, $lte: req.query.edate },
      type: req.query.type,
    })
    .project({ _id: 0, date: 1, ["general.all_responses"]: 1 })
    .toArray((err, documents) => {
      {
        if (err) console.log(err);
        else {
          var series = [];
          var Excellent = [];
          var Good = [];
          var Average = [];
          var Poor = [];
          var Bad = [];
          documents.forEach((d) => {
            Excellent.push(d.general.all_responses[0].Excellent);
            Good.push(d.general.all_responses[0].Good);
            Average.push(d.general.all_responses[0].Average);
            Poor.push(d.general.all_responses[0].Poor);
            Bad.push(d.general.all_responses[0].Bad);
          });
          series.push(
            {
              name: "Excellent",
              data: Excellent,
            },
            {
              name: "Good",
              data: Good,
            },
            {
              name: "Average",
              data: Average,
            },
            {
              name: "Poor",
              data: Poor,
            },
            {
              name: "Bad",
              data: Bad,
            }
          );
          allRes_TS.series = series;
          //   allRes_TS.labels = ["Excellent", "Good", "Average", "Poor", "Bad"];

          allRes_TS.xaxis.categories.min = moment(req.query.sdate).format(
            "DD MMM YYYY"
          );
          allRes_TS.xaxis.categories.max = moment(req.query.edate).format(
            "DD MMM YYYY"
          );
          allRes_TS.yaxis.min = min(documents[0].general.all_responses[0]);
          allRes_TS.yaxis.max = max(documents[0].general.all_responses[0]);
          console.log(documents[0].general.all_responses);

          res.status(200).render("chart_template", {
            option: JSON.stringify(allRes_TS),
          });
        }
      }
    });
});
module.exports = router;

//  example as shown (http://localhost:4000/Bhopal/allRes_TS/?sdate=2020-03-04&edate=2020-04-04&type=EI) in browser
