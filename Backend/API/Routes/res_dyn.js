//importing express
const express = require("express");
const router = express.Router();

//importing logger
const serverLog = require('../logger');

//importing DB module
const db = require("../db");

//resp_dyn chart route code
router.get("/:air/res/:type", (req, res) => {
  const type = req.params.type +".responses";
  const dt = req.query.dev;
  serverLog.info(`REQUESTED Response Dynamic chart with Airport=${req.params.air}, `+
                 `Section=${req.params.type}, `+
                 `Date=${req.query.dt}, `+
                 `Type=${req.query.dev}`
                );

  db.getDB()
    .collection(req.params.air)
    .find({ date: req.query.date, type: req.query.dev })
    .project({ _id: 0, [type]: 1 })
    .toArray((err, documents) => {
      if (err){
        serverLog.error(`Res_Dyn chart DATABASE ERROR with Airport=${req.params.air}, `+
                        `Section=${req.params.type}, `+
                        `Date=${req.query.dt}, `+
                        `Type=${req.query.dev} -> ${err}`
                       );
        res.status(400).send(err);
      }  
      else {
        var badC=poorC=averageC=goodC=excellentC=0;
        var resp;
        var series = [];

        var badA = [];
        var poorA = [];
        var averageA = [];
        var goodA = [];
        var excellentA = [];

        if (type === "by_device.responses")
          resp = documents[0].by_device.responses
        if (type === "by_survey.responses")
          resp = documents[0].by_survey.responses
        if (type === "by_group.responses")
          resp = documents[0].by_group.responses

        for (i = 0; i < resp.length; i += 2) {
          badC += resp[i]["Bad"];
          poorC += resp[i]["Poor"];
          averageC += resp[i]["Average"];
          goodC += resp[i]["Good"];
          excellentC += resp[i]["Excellent"];

          badA.push({
            x: resp[i]["area"],
            y: resp[i]["Bad"]
          });

          poorA.push({
            x: resp[i]["area"],
            y: resp[i]["Poor"]
          });

          averageA.push({
            x: resp[i]["area"],
            y: resp[i]["Average"]
          });

          goodA.push({
            x: resp[i]["area"],
            y: resp[i]["Good"]
          });

          excellentA.push({
            x: resp[i]["area"],
            y: resp[i]["Excellent"]
          });
        }
        
        series.push(
          {
            y: badC,
            quarters: badA
          },
          {
            y: poorC,
            quarters: poorA
          },
          {
            y: averageC,
            quarters: averageA
          },
          {
            y: goodC,
            quarters: goodA
          },
          {
            y: excellentC,
            quarters: excellentA
          }
        );
        res.status(200).render("chart_template_dynamic",{option:JSON.stringify(series),dtype: dt});
      }
    });
});

module.exports = router;
