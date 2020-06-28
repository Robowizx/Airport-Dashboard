//code for serving API goes here.
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const exp_chart = require('./routes/exp_imp_index');
const res_dyn = require('./routes/res_dyn');
const res_stk = require('./routes/res_his');
const donut = require('./routes/donut');
const db = require('./db')
const body_parser = require("body-parser");

app.set('views', './views');
app.set('view engine', 'pug');
app.set('view cache',true);

app.use(body_parser.json());
app.use(express.static('./Public'));
app.use(exp_chart);
app.use(res_dyn);
app.use(res_stk);
app.use(donut);

db.connect((err)=>{
    if(err){
        console.error('unable to connect: '+err);
        process.exit(1);
    } else {
        console.log("DB is online");
    }
});

app.get('/',(req,res)=>{
    res.status(200).send('Server is up and running');
});

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));  