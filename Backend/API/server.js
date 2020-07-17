//importing express and setting port
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

//setting up env file
require('dotenv').config();

//importing mongoose
const mongoose = require('mongoose');

//importing helmet for response header security
const helmet = require('helmet');

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
const devexp = require('./Routes/devExp');
const top_least_guage = require('./Routes/top_least_gauge');
const exp_till_date = require('./Routes/exp_till_date_timeseries');
const heatmap = require('./Routes/resp_heatmap');
const auth = require('./Routes/auth');

//importing DB module
const db = require("./db");

//importing parser
//const body_parser = require("body-parser");

//setting view engine
app.set("views", "./views");
app.set("view engine", "pug");
app.set("view cache", true);

//setting parser for post requests
//app.use(body_parser.json());

//declaring static resources
app.use(express.static("./Public"));

//adding routes
app.use(helmet());
app.use(auth);
app.use('/chart',
        exp_chart,
        res_dyn,
        res_stk,
        donut,
        top_least,
        top_least_series,
        Exp_Index_Series,
        res_time,
        allRes_TS,
        devexp,
        top_least_guage,
        exp_till_date,
        heatmap
       );

//checking connection to DB
db.connect((err) => {
  if (err) {
    serverLog.error(`Unable to connect to Database -> ${err}`);
    process.exit(1);
  } else {
    serverLog.info(`Airport Database is online.`);
  }
});
mongoose.connect(`mongodb+srv://${process.env.UNAME}:${process.env.PASS}@cluster0-qkpve.mongodb.net/AuthDB?retryWrites=true&w=majority`,{ useCreateIndex:true, useNewUrlParser : true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open",()=>{
  serverLog.info(`Auth Database is online.`);
});

//dummy home route
app.get("/", (req, res) => {
  res.status(200).send("Server is up and running");
});

//declaring server port
app.listen(PORT, () =>
  serverLog.info(`Server listening at http://localhost:${PORT}`)
);