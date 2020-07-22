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
  const dt = req.query.type;
  serverLog.info(`REQUESTED Response Dynamic chart with Airport=${req.params.air}, `+
                 `Section=${req.params.type}, `+
                 `Date=${req.query.date}, `+
                 `Type=${req.query.type}`
                );

  db.getDB()
    .collection(req.params.air)
    .find({ date: req.query.date, type: req.query.type })
    .project({ _id: 0, [type]: 1 })
    .toArray((err, documents) => {
      if (err){
        serverLog.error(`Res_Dyn chart DATABASE ERROR with Airport=${req.params.air}, `+
                        `Section=${req.params.type}, `+
                        `Date=${req.query.date}, `+
                        `Type=${req.query.type} -> ${err}`
                       );
        res.status(500).send(err);
      }
      else if(Object.keys(documents).length==0){
        serverLog.warn(`Res_Dyn chart DATA NOT FOUND with Airport=${req.params.air}, `+
                        `Section=${req.params.type}, `+
                        `Type=${req.query.type}, `+
                        `Date=${req.query.date}`
                       );
        res.status(404).send("404 data not found");               
      }  
      else {
        var badC = (poorC = averageC = goodC = excellentC = 0);
        var resp = documents[0][`${req.params.type}`].responses;
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
        res.status(200).render("chart_template_dynamic",{option:JSON.stringify(series),dtype: dt});
      }
    });
});

module.exports = router;
