const express = require("express");
const router = express.Router();
const { line_chart } = require("../chart_metadata.json");
const db = require("../db");
const moment = require("moment");
router.get("/:air/exp/:sec", (req, res) => {
  let db_query = { _id: 0, date: 1 };
  db_query[`${req.params.sec}.responses`] = 1;

  db.getDB()
    .collection(req.params.air)
    .find({
      date: { $gte: req.query.sdate, $lt: req.query.edate },
      type: req.query.type,
    })
    .project(db_query)
    .toArray((err, documents) => {
      if (err) console.log(err);
      else {
        console.log(documents[0][`${req.params.sec}`]);
        let area = [];
        let series = [];

        documents.forEach((d) => {
          // console.log(d);

          date = moment(d.date).format("DD MMM YYYY");
          let resp = d[`${req.params.sec}`].responses;
          for (i = 0; i < resp.length; i += 2) {
            // console.log(resp[i].area);
            if (!area.includes(resp[i].area)) {
              area.push(resp[i].area);
              series.push({
                name: resp[i].area,
                data: [[new Date(date).getTime(), resp[i]["Exp Index"]]],
              });
            }
            // console.log(resp[i]['Exp Index']);
            else {
              let x = series.findIndex((x) => x.name === resp[i].area);
              series[x].data.push([
                new Date(date).getTime(),
                resp[i]["Exp Index"],
              ]);
            }
          }
        });

        console.log(area);
        console.log(series);

        //    brush_chart.series = series;
        //    brush_chart.chart.selection.xaxis.min = moment(req.query.sdate).format('DD MMM YYYY');
        //    brush_chart.chart.selection.xaxis.max = moment(req.query.edate).format('DD MMM YYYY');
        //    line_chart.series = series;
        //    console.log(line_chart)
        res.render("chart_exp_timeseries", {
          option: JSON.stringify(line_chart),
          series: JSON.stringify(series),
          area: JSON.stringify(area),
        });
      }
    });
});

module.exports = router;
