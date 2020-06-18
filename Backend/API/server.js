//code for serving API goes here.
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const routes = require('./routes/api');
const db = require('./db')
const body_parser = require("body-parser");

app.set('views', './views');
app.set('view engine', 'pug');

app.use(body_parser.json());
app.use(express.static('./Public'));
app.use('/',routes);


const dbName = "AirportDB";
const collectionName = "Agartala"

db.connect((err)=>{
    if(err){
        console.log('unable to connect');
        process.exit(1);
    } else {
        console.log("Connected")
    }
})
app.get('/',(req,res)=>{
    db.getDB().collection(collectionName).find({date:"2020-03-01"}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            console.log(documents);
            res.json(documents);
        }
    })
});

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));  