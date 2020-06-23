//code for serving API goes here.
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const exp_chart = require('./routes/exp_imp_index');
const db = require('./db')
const body_parser = require("body-parser");

app.set('views', './views');
app.set('view engine', 'pug');
app.set('view cache',true);

app.use(body_parser.json());
app.use(express.static('./Public'));
app.use(exp_chart);


db.connect((err)=>{
    if(err){
        console.log('unable to connect');
        process.exit(1);
    } else {
        console.log("DB is online");
    }
});

app.get('/',(req,res)=>{
    res.status(200).send('Server is up and running');
});

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));  