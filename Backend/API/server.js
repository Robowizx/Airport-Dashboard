//importing express and setting port
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

//importing logger
const serverLog = require("./logger");

//importing routes
const exp_chart = require('./Routes/exp_imp_index');
const res_dyn = require('./Routes/res_dyn');
const res_stk = require('./Routes/res_his');
const res_time = require('./Routes/res_time');
const donut = require('./Routes/donut');
const top_least = require('./Routes/top_n_least');
const top_least_series = require('./Routes/top_least_timeseries');
const Exp_Index_Series = require('./Routes/line_exp_index_time_series');
const allRes_TS = require('./Routes/allRes_TS');

//importing DB module
const db = require("./db");

//importing parser
const body_parser = require("body-parser");

//setting view engine
app.set("views", "./views");
app.set("view engine", "pug");
app.set("view cache", true);

//setting parser for post requests
app.use(body_parser.json());

//declaring static resources
app.use(express.static("./Public"));

//adding routes
app.use(exp_chart);
app.use(res_dyn);
app.use(res_stk);
app.use(donut);
app.use(top_least);
app.use(top_least_series);
app.use(Exp_Index_Series);
app.use(res_time);
app.use(allRes_TS);

//checking connection to DB
db.connect((err) => {
  if (err) {
    serverLog.error(`Unable to connect to Database -> ${err}`);
    process.exit(1);
  } else {
    serverLog.info(`Database is online.`);
  }
});

//dummy home route
app.get("/", (req, res) => {
  res.status(200).send("Server is up and running");
});

//declaring server port
app.listen(PORT, () =>
  serverLog.info(`Server listening at http://localhost:${PORT}`)
);
