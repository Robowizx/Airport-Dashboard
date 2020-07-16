const mongoose = require('mongoose');
const {Appication, Application} = require('./model');

mongoose.connect(`mongodb+srv://${process.env.UNAME}:${process.env.PASS}@cluster0-qkpve.mongodb.net/AuthDB?retryWrites=true&w=majority`,{ useCreateIndex:true, useNewUrlParser : true, useUnifiedTopology: true });
const conn = mongoose.connection;
conn.once('open',()=>{
    Application.create({title:"frontend",oauth_id:123456789,domains:['localhost']},(err,app)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("sucess");
            conn.close();
        }
    })
});