// // mongodb driver

const MongoClient = require("mongodb").MongoClient;
const dbname = "AirportDB";
const url = "mongodb+srv://dbAAI:maverick123@cluster0-qkpve.mongodb.net/AirportDB?retryWrites=true&w=majority";
// Options for mongoDB
const mongoOptions = {useNewUrlParser : true, useUnifiedTopology: true};

const state = {
    db : null
};

const connect = (cb) =>{
    if(state.db)
        cb();
    else{
        // attempt to get database connection
        MongoClient.connect(url,mongoOptions,(err,client)=>{
            if(err)
                cb(err);
            else{
                state.db = client.db(dbname);
                state['client'] = client;
                cb();
            }
        });
    }
}


// returns database connection 
const getDB = ()=>{
    return state.db;
}

const getClient = ()=>{
    return state.client;
}

module.exports = {getDB,connect,getClient};