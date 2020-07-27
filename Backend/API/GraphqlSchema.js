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

const deviceType = new GraphQLObjectType({
    name:'device',
    fields:{
        device_name:{ type: GraphQLString },
        avg_exp_index: { type: GraphQLFloat },
        exp: { type: GraphQLFloat },
        rank: { type: GraphQLInt },
        avg_imp_index: { type: GraphQLFloat },

    }
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
                      avg_imp_index: document[i].general.avg_imp_index
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
                        .findOne({_id:'device'},{projection:{devices:1,_id:0}})
                        .then((doc)=>{
                            res = doc.devices;
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
        }
    }
});

module.exports = new GraphQLSchema({
    query: rootQueryType
});