const express = require("express");
const router = express.Router();
const moment = require("moment");
const { allResponseTime } = require("../chart_metadata.json");
const db = require("../db");

router.get("/:air/restime/:sec", (req, res) => {
  const type = req.params.sec + ".responses";
  const dev = req.query.type;
  db.getDB()
    .collection(req.params.air)
    .find(
      {
        type: dev,
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
        let series = [],
          area = [];
        for (i = 0; i < documents.length; i++) {
          let date = moment(documents[i].date).format("DD MMM");
          let resp = documents[i][`${req.params.sec}`].responses;
          for (j = 0; j < resp.length; j += 2) {
            if (!area.includes(resp[j].area)) {
              area.push(resp[j].area);
              series.push({
                id: resp[j].area,
                val: [
                  {
                    name: "Bad",
                    data: [[date, resp[j].Bad]],
                  },
                  {
                    name: "Poor",
                    data: [[date, resp[j].Poor]],
                  },
                  {
                    name: "Average",
                    data: [[date, resp[j].Average]],
                  },
                  {
                    name: "Good",
                    data: [[date, resp[j].Good]],
                  },
                  {
                    name: "Excellent",
                    data: [[date, resp[j].Excellent]],
                  },
                ],
              });
            } else {
              let x = series.findIndex((x) => x.id === resp[j].area);
              series[x].val[0].data.push([date, resp[j].Bad]);
              series[x].val[1].data.push([date, resp[j].Poor]);
              series[x].val[2].data.push([date, resp[j].Average]);
              series[x].val[3].data.push([date, resp[j].Good]);
              series[x].val[4].data.push([date, resp[j].Excellent]);
            }
          }
        }
        res.render("chart_template_all_res_time", {
          option: JSON.stringify(allResponseTime),
          series: JSON.stringify(series),
          area: JSON.stringify(area),
          device: dev
        });
      }
    });
});

module.exports = router;
