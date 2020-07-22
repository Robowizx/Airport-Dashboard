//importing graphql tools
const {GraphQLSchema,
       GraphQLFloat,
       GraphQLInt,
       GraphQLList,
       GraphQLString,
       GraphQLObjectType
} = require('graphql');

require('dotenv').config();

//importing db module
const db = require('./db');

const deviceType = new GraphQLObjectType({
    name:'device',
    fields:{
        name:{ type: GraphQLString },
        exp_till_date: { type: GraphQLFloat },
        exp: { type: GraphQLFloat },
        rank: { type: GraphQLInt }
    }
});


const air_list_type = new GraphQLObjectType({
    name:'air_list',
    fields: ()=>({
        name:{ type: GraphQLString },
        airport_name: { type: GraphQLString },
        code: { type: GraphQLString },
        atype: { type: GraphQLString },
        location: {type: new GraphQLObjectType({
            name:'location_list',
            fields: ()=>({
                lat: { type: GraphQLFloat },
                long: { type: GraphQLFloat }
            })
        })},
        exp: { type: GraphQLFloat }
    })    
});

const airportType = new GraphQLObjectType({
    name:'airport',
    fields: ()=>({
        name:{ type: GraphQLString },
        airport_name: { type: GraphQLString },
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
        num_of_devs: { type: GraphQLInt },
        active_surveys: { type: GraphQLInt }
    })
});

const air_resolve = async (parent,args)=>{
    let res={},filter={};
    if(args.code)
        filter.code = args.code;
    else
        filter.name = args.name;
    await db.getDB()
            .collection('Meta')
            .findOne(filter)
            .then((document)=>{
                res = document;
            })
            .catch((err)=>{
                console.log(err);
            });
    if(Object.keys(res).length!=0){
        await db.getDB()
                .collection(res.name)
                .find({date:args.date},{projection:{_id:0,type:1,general:1}})
                .toArray()
                .then((docs)=>{
                    res.devices = [];
                    res.num_of_devs = docs.length;
                    res.active_surveys = docs[0].general.active_surveys.num;
                    for(let i=0;i<docs.length;i++){
                        res.devices.push({
                            name: docs[i].type,
                            exp_till_date: docs[i].general.avg_exp_index,
                            exp: docs[i].general.all_responses[0]['Exp Index'],
                            rank: docs[i].general.rank
                        });
                    }
                })
                .catch((err)=>{
                    console.log(err);
                })
    }
    return res;            
};

const rootQueryType = new GraphQLObjectType({
    name:'root',
    fields:{
        airport_name:{
            type: airportType,
            args: {
                name:{ type: GraphQLString },
                date:{ type: GraphQLString }
            },
            resolve: air_resolve
        },
        airport_code:{
            type: airportType,
            args: {
                code:{ type: GraphQLString },
                date:{ type: GraphQLString }
            },
            resolve: air_resolve
        },
        air_list:{
            type: new GraphQLList(air_list_type),
            async resolve(parent,args){
                let res=[],list;
                await db.getDB()
                        .collection('Meta')
                        .find()
                        .toArray()
                        .then((docs)=>{ res = docs})
                        .catch((err)=> console.log(err));
                return res;        
            }        
        },
        device:{
            type: deviceType,
            args:{
                air: { type: GraphQLString },
                date: { type: GraphQLString },
                dev: { type: GraphQLString },
            },
            async resolve(parent,args){
                var res={};
                await db.getDB()
                        .collection(args.air)
                        .findOne({date:args.date,type:args.dev},{projection:{_id:0,general:1}})
                        .then((doc)=>{
                                res.name = args.dev;
                                res.exp_till_date = doc.general.avg_exp_index;
                                res.exp = doc.general.all_responses[0]['Exp Index'];
                                res.rank = doc.general.rank;
                        })
                        .catch((err)=>{
                            console.log(err);
                        });        
                return res;        
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: rootQueryType
});