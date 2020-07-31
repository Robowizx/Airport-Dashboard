//importing graphql tools
const {GraphQLSchema,
       GraphQLFloat,
       GraphQLInt,
       GraphQLList,
       GraphQLString,
       GraphQLObjectType,
       GraphQLNonNull
} = require('graphql');

require('dotenv').config();

//importing db module
const db = require('./db');

const totalType = new GraphQLObjectType({
    name:'total',
    fields:{
        num: {type: GraphQLInt},
        active: {type: GraphQLInt}
    }
});
const surveyType = new GraphQLObjectType({
    name:'survey',
    fields:{
        num: {type: GraphQLInt},
        completed: {type: GraphQLInt}
    }
});

const deviceType = new GraphQLObjectType({
    name:'device',
    fields:()=>({
        device_name:{ type: GraphQLString },
        avg_exp_index: { type: GraphQLFloat },
        exp: { type: GraphQLFloat },
        rank: { type: GraphQLInt },
        avg_imp_index: { type: GraphQLFloat },
        total_devices: {type: totalType },
        active_surveys: {type: surveyType},
        total_resp_till_date: {type: GraphQLInt}
    })
});

const airportType = new GraphQLObjectType({
    name:'airport',
    fields: ()=>({
        name:{ type: GraphQLString },
        airport_name: { type: GraphQLString },
        state: {type: GraphQLString },
        code: { type: GraphQLString },
        atype: { type: GraphQLString },
        location: {type: new GraphQLObjectType({
            name:'location',
            fields: ()=>({
                lat: { type: GraphQLFloat },
                long: { type: GraphQLFloat }
            })
        })},
        exp: { type: GraphQLFloat },
        devices: { type: GraphQLList(deviceType) },
        num_of_devs: { type: GraphQLInt }
    })
});

const air_resolve = async (parent,args)=>{
    let res={},filter={};
    if(args.code)
        filter.code= args.code;                
    else
        filter.name = args.name;
    await db.getDB()
            .collection('Meta')
            .findOne(filter,{projection:{_id:0,name:1,airport_name:1,code:1,atype:1,location:1}})
            .then((doc)=>{
                res = doc;
            })
            .catch((err)=>console.log(err));

    await db.getDB()
            .collection(res.name)
            .find({date:args.date},{projection:{_id:0,general:1,type:1}})
            .toArray()
            .then((document)=>{
              let ex=0;  
              res.num_of_devs = document.length;
              res.devices=[];
              for(let i=0;i<document.length;i++){
                  ex += document[i].general.avg_exp_index;
                  res.devices.push({
                      device_name:document[i].type,
                      avg_exp_index: document[i].general.avg_exp_index,
                      exp: document[i].general.all_responses[0]['Exp Index'],
                      rank: document[i].general.rank,
                      avg_imp_index: document[i].general.avg_imp_index,
                      total_devices: document[i].general.total_devices,
                      active_surveys: document[i].general.active_surveys,
                      total_resp_till_date: document[i].general.total_resp_till_date
                  });
              }
              ex /= document.length;
              res.exp = ex;
            })
            .catch((err)=> console.log(err)); 
    return res;            
};

const rootQueryType = new GraphQLObjectType({
    name:'root',
    fields:{
        airport_name:{
            type: airportType,
            args: {
                name:{ type: new GraphQLNonNull(GraphQLString) },
                date:{ type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: air_resolve
        },
        airport_code:{
            type: airportType,
            args: {
                code:{ type: new GraphQLNonNull(GraphQLString) },
                date:{ type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: air_resolve
        },
        air_list:{
            type: new GraphQLList(airportType),
            async resolve(parent,args){
                let res=[],i=0;
                await db.getDB()
                        .collection('Meta')
                        .find({_id:{$ne:'device'}})
                        .toArray()
                        .then((docs)=>{ res = docs})
                        .catch((err)=> console.log(err));

                for(let i=0;i<res.length;i++)
                    res[i].num_of_devs = res[i].devices.length;
                return res;        
            }
        },
        device_list:{
            type: new GraphQLList(GraphQLString),
            async resolve(parent,args){
                let res;
                await db.getDB()
                        .collection('Meta')
                        .findOne({_id:'device'},{projection:{device_names:1,_id:0}})
                        .then((doc)=>{
                            res = doc.device_names;
                        })
                        .catch((err)=>console.log(err));
                return res;        
            }
        },
        best_worst:{
            type: new GraphQLList(airportType),
            args: {
                order: {type: new GraphQLNonNull(GraphQLInt)}
            },
            async resolve(parent,args){
                let res;
                await db.getDB()
                        .collection('Meta')
                        .find({_id:{$ne:'device'}})
                        .sort({exp:args.order})
                        .limit(5)
                        .toArray()
                        .then((docs)=>{
                            res = docs;
                        })
                        .catch((err)=> console.log(err));
                return res;        
            }
        },
        device_name:{
            type: deviceType,
            args:{
                air:{type: new GraphQLNonNull(GraphQLString)},
                name:{type: new GraphQLNonNull(GraphQLString)},
                date:{type: new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent,args){
                let res={};
                await db.getDB()
                        .collection(args.air)
                        .findOne({date:args.date,type:args.name},{projection:{_id:0,type:1,general:1}})
                        .then((doc)=>{
                            res.device_name=doc.type;
                            res.avg_exp_index=doc.general.avg_exp_index;
                            res.exp=doc.general.all_responses[0]['Exp Index'];
                            res.rank= doc.general.rank;
                            res.avg_imp_index= doc.general.avg_imp_index;
                            res.total_devices= doc.general.total_devices;
                            res.active_surveys= doc.general.active_surveys;
                            res.total_resp_till_date= doc.general.total_resp_till_date;
                        })
                        .catch((err)=> console.log(err));
                return res;        
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: rootQueryType
});