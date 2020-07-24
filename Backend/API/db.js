//importing MongoDB driver
const MongoClient = require("mongodb").MongoClient;

//database connection uri
const uri = `mongodb+srv://${process.env.UNAME}:${process.env.PASS}@cluster0-qkpve.mongodb.net/AirportDB?retryWrites=true&w=majority`;

// Options for mongoDB
const mongoOptions = { useNewUrlParser : true, useUnifiedTopology: true };

//state to hold DB connection object
const state = {
    db : null
};

//function to connect to DB
const connect = (cb) =>{
    if(state.db)
        cb();
    else{
        // attempt to get database connection
        MongoClient.connect(uri,mongoOptions,(err,client)=>{
            if(err)
                cb(err);
            else{
                state.db = client.db('AirportDB');
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

//returns database client object
const getClient = ()=>{
    return state.client;
}

module.exports = {getDB,connect,getClient};
