const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:air/res/:sec", (req, res) => {
  const type = req.params.sec + ".responses";
  const dt = req.query.type;
  db.getDB()
    .collection(req.params.air)
    .find({ date: req.query.date, type: req.query.type })
    .project({ _id: 0, [type]: 1 })
    .toArray((err, documents) => {
      if (err) console.log(err);
      else {
        var badC = (poorC = averageC = goodC = excellentC = 0);
        var resp = documents[0][`${req.params.sec}`].responses;
        var series = [];
        var badA = [];
        var poorA = [];
        var averageA = [];
        var goodA = [];
        var excellentA = [];

        for (i = 0; i < resp.length; i += 2) {
          badC += resp[i]["Bad"];
          poorC += resp[i]["Poor"];
          averageC += resp[i]["Average"];
          goodC += resp[i]["Good"];
          excellentC += resp[i]["Excellent"];

          badA.push({
            x: resp[i]["area"],
            y: resp[i]["Bad"],
          });

          poorA.push({
            x: resp[i]["area"],
            y: resp[i]["Poor"],
          });

          averageA.push({
            x: resp[i]["area"],
            y: resp[i]["Average"],
          });

          goodA.push({
            x: resp[i]["area"],
            y: resp[i]["Good"],
          });

          excellentA.push({
            x: resp[i]["area"],
            y: resp[i]["Excellent"],
          });
        }

        series.push(
          {
            y: badC,
            quarters: badA,
          },
          {
            y: poorC,
            quarters: poorA,
          },
          {
            y: averageC,
            quarters: averageA,
          },
          {
            y: goodC,
            quarters: goodA,
          },
          {
            y: excellentC,
            quarters: excellentA,
          }
        );
        res.render("chart_template_dynamic", {
          option: JSON.stringify(series),
          dtype: dt,
        });
      }
    });
});

module.exports = router;
