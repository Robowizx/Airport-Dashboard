const express = require("express");
const router = express.Router();
const moment = require("moment");
const { allResponseTime } = require("../chart_metadata.json");
const db = require("../db");

//getting data from server in the form of date wise is done

router.get("/:air/restime/:sec", (req, res) => {
  const type = req.params.sec + ".responses";
  db.getDB()
    .collection(req.params.air)
    .find(
      {
        type: req.query.type,
        $and: [
          { date: { $lte: req.query.edate } },
          { date: { $gte: req.query.sdate } },
        ],
      },
      { date: 1 }
    )
    .sort({ date: 1 })
    .project({ _id: 0, [type]: 1, date: 1 })
    .toArray((err, documents) => {
      if (err) console.log(err);
      else {
        //test print of airport name
        console.log(req.params.air);

        var bad = [],poor = [],good = [], average = [], excellent = [], dates = [], series = [], area = [];
        for (i = 0; i < documents.length; i++) {
          //date value
          dates.push(moment(documents[i].date).format("DD MMM"));
          var resp = documents[i][`${req.params.sec}`].responses;
          
          // for (j = 0; j < resp.length; j += 2) {
          //   //perticular area responses in thier coresponding array
          //   console.log(resp[j].area);
          // }
          area.push(resp[0].area);
          excellent.push(resp[0].Excellent);
          good.push(resp[0].Good);
          average.push(resp[0].Average);
          bad.push(resp[0].Bad);
          poor.push(resp[0].Poor);
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
        allResponseTime.series = series;
        allResponseTime.xaxis.categories = dates;
        // allResponseTime.title.text = `All Respponses For ${resp[0].area}`;
        res.render("chart_template", {
          option: JSON.stringify(allResponseTime),
        });
      }
    });
});

module.exports = router;
