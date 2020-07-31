const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const serverLog = require("../logger");
const allResponseTime = require("../Meta/allResponseTime.json");
const db = require("../db");

router.get("/:air/restime/:sec", (req, res) => {
  const type = req.params.sec + ".responses";
  const dev = req.query.type;
  serverLog.info(
    `Requested response time series chart with Airport=${req.params.air}, ` +
      `Section=${req.params.sec}, ` +
      `Type=${req.query.type}, ` +
      `SDate=${req.query.sdate}, ` +
      `EDate=${req.query.edate}`
  );

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
      if (err) {
        serverLog.error(
          `response time series chart DATABASE ERROR with Airport=${req.params.air}, ` +
            `Section=${req.params.sec}, ` +
            `Type=${req.query.type}, ` +
            `SDate=${req.query.sdate}, ` +
            `EDate=${req.query.edate} -> ${err}`
        );
        res.status(400).send(err);
      } else if (Object.keys(documents).length == 0) {
        serverLog.warn(
          `response time series chart DATA NOT FOUND with Airport=${req.params.air}, ` +
            `Section=${req.params.sec}, ` +
            `Type=${req.query.type}, ` +
            `SDate=${req.query.sdate}, ` +
            `EDate=${req.query.edate}`
        );
        res.status(404).send("404 data not found");
      } else {
        let series = [],
          area = [];
        for (i = 0; i < documents.length; i++) {
          let date = new Date(documents[i].date).getTime();
          let resp = documents[i][`${req.params.sec}`].responses;
          for (j = 0; j < resp.length; j += 2) {
            if (!area.includes(resp[j].area)) {
              area.push(resp[j].area);
              series.push({
                id: resp[j].area,
                val: [
                  {
                    name: "Excellent",
                    data: [[date, resp[j].Excellent]],
                  },
                  {
                    name: "Good",
                    data: [[date, resp[j].Good]],
                  },
                  {
                    name: "Average",
                    data: [[date, resp[j].Average]],
                  },
                  {
                    name: "Poor",
                    data: [[date, resp[j].Poor]],
                  },
                  {
                    name: "Bad",
                    data: [[date, resp[j].Bad]],
                  },
                ],
              });
            } else {
              let x = series.findIndex((x) => x.id === resp[j].area);
              series[x].val[0].data.push([date, resp[j].Excellent]);
              series[x].val[1].data.push([date, resp[j].Good]);
              series[x].val[2].data.push([date, resp[j].Average]);
              series[x].val[3].data.push([date, resp[j].Poor]);
              series[x].val[4].data.push([date, resp[j].Bad]);
            }
          }
        }
        res.status(200).render("chart_template_all_res_time", {
          option: JSON.stringify(allResponseTime),
          series: JSON.stringify(series),
          area: JSON.stringify(area),
          device: dev,
        });
      }
    });
});

module.exports = router;
