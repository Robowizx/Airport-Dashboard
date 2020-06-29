const express = require("express");
const router = express.Router();
const { donut } = require("../chart_metadata.json");
const db = require("../db");

router.get("/:air/res_donut/", (req, res) => {
  const dates = req.query.date;
  const airport = req.params.air;

  db.getDB()
    .collection(airport)
    .find({ date: dates, type: req.query.type})
    .project({_id: 0, ["general.all_responses"]:1})
    .toArray((err, documents) => {
      {
        if (err) console.log(err);
        else {
          donut.series.push(documents[0].general.all_responses[0].Excellent);
          donut.series.push(documents[0].general.all_responses[0].Good);
          donut.series.push(documents[0].general.all_responses[0].Average);
          donut.series.push(documents[0].general.all_responses[0].Poor);
          donut.series.push(documents[0].general.all_responses[0].Bad);
          donut.labels = ["Excellent", "Good", "Average", "Poor", "Bad"];
          console.log(documents[0].general.all_responses);

          res.render("chart_template", {
            option: JSON.stringify(donut),
          });
        }
      }
    });
});
module.exports = router;
