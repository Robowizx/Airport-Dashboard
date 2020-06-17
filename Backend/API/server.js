//code for serving API goes here.
const express = require('express');
const pug = require('pug');
const app = express();

const data = {
    chart: {
        type: 'bar'
    },
    series: [{
        name: 'sales',
        data: [30,40,45,50,49,60,70,91,125]
    }],
    xaxis: {
        categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
    }
};

let chart_func = pug.compileFile('./chart_template.pug');

app.use(express.static('./Public'));

app.get('/',(req, res)=> {
    let html = pug.renderFile('./home.pug',{cache: true});
    console.log('html = '+html);
    res.status(200).send(html);
  });

app.get('/histogram',(req,res)=> { 
    let html = chart_func({option: JSON.stringify(data)});
    console.log('html = '+html);
    res.status(200).send(html);
});

app.listen(4000, () => console.log(`Example app listening at http://localhost:4000`));  