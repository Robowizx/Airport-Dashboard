//importing express, https modules, certificates... and setting port
const https = require('https');
const express = require("express");
const {graphqlHTTP} = require('express-graphql');
const gqlschema = require("./GraphqlSchema");
const app = express();
const fs = require('fs');
const privateKey = fs.readFileSync('backend_pkey.key','utf8');
const certificate = fs.readFileSync('backend_certificate.crt','utf8');
const httpsServer = https.createServer({key: privateKey,cert:certificate},app);
const PORT = process.env.PORT || 4000;

//setting up env file
require("dotenv").config();

//importing mongoose
const mongoose = require("mongoose");

//importing helmet for response header security
const helmet = require("helmet");

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
const airport = require('./Routes/best_worst_airport');
const spark_line=require('./Routes/spark_line');
const spark_donut=require('./Routes/spark_donut');
const gateKeeper = require('./Routes/gateKeeper');

//importing DB module
const db = require("./db");

//setting view engine
app.set("views", "./views");
app.set("view engine", "pug");
app.set("view cache", true);

//declaring static resources
app.use(express.static("./Public"));

//adding cross origin resource sharing (cors) support
app.use(require('cors')());

//adding routes
app.use(helmet());

console.log(typeof(graphqlHTTP));

//checking connection to DB
db.connect((err) => {
  if (err) {
    serverLog.error(`Unable to connect to AirportDB -> ${err}`);
    process.exit(0);
  } else {
    serverLog.info(`Airport Database is online.`);
  }
});

mongoose.connect(`mongodb+srv://${process.env.UNAME}:${process.env.PASS}@cluster0-qkpve.mongodb.net/AuthDB?retryWrites=true&w=majority`,{ useCreateIndex:true, useNewUrlParser : true, useUnifiedTopology: true },(err)=>{
  if(err){
    serverLog.error(`Unable to connect to AuthDB -> ${err}`);
    process.exit(0);
  }
  else{
    serverLog.info(`Auth Database is online.`);
  }
});

app.use('/graphql',graphqlHTTP({
  schema: gqlschema,
  graphiql: true
}));

app.use(/*gateKeeper,*/ 
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
        exp_till_date,
        heatmap,
        top_least_guage,
        airport,
        spark_line,
        spark_donut
       );


//dummy home route
app.get("/", (req, res) => {
  res.status(200).send("Server is up and running");
});

//declaring server port
httpsServer.listen(PORT, () => serverLog.info(`Server listening at https://localhost:${PORT}`));
