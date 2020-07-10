// // mongodb driver

const MongoClient = require("mongodb").MongoClient;
const dbname = "AirportDB";
const url = "connection string here";
// Options for mongoDB
const mongoOptions = {useNewUrlParser : true,useUnifiedTopology: true};

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
                cb();
            }
        });
    }
}


// returns database connection 
const getDB = ()=>{
    return state.db;
}

module.exports = {getDB,connect};
