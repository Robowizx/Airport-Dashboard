const express = require("express");
const router = express.Router();
const db = require("../db");

//getting data from server in the form of date wise is done

router.get("/:air/restime/:type", (req, res) => {
  const type = req.params.type + ".responses";
  db.getDB()
    .collection(req.params.air)
    .find(
      {
        type: req.query.dtype,
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
        for (i = 0; i < documents.length; i++) {
          //date value
          console.log(documents[i].date);
          var resp;
          if (type === "by_device.responses") {
            resp = documents[i].by_device.responses;
          }
          if (type === "by_survey.responses") {
            resp = documents[i].by_survey.responses;
          }
          if (type === "by_group.responses") {
            resp = documents[i].by_group.responses;
          }
          for (j = 0; j < resp.length; j += 2) {
            //perticular area responses in thier coresponding array
            console.log(resp[j].area);
          }
        }
      }
    });
});

module.exports = router;
