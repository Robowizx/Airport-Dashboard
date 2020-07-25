require('dotenv').config();
const db = require('./db');

db.connect((err)=>{
    if(err) console.log(err);
    else{
        db.getDB()
          .listCollections({},{nameOnly:true})
          .toArray((err,docs)=>{
              if(err) console.log(err);
              else{
                 docs.forEach(async(element) => {
                     if(element.name != 'Meta'){
                         await db.getDB()
                                 .collection(element.name)
                                 .find({date:'2021-03-01'},{projection:{'general.avg_exp_index':1}})
                                 .toArray(async (err,output)=>{
                                   if(err) console.log(err)
                                   else{
                                       let ex = 0;
                                       if(output){
                                        for(let i=0;i<output.length;i++)
                                        ex += output[i].general.avg_exp_index;
                                        ex /= output.length;
                                       }
                                       console.log(element.name);
                                       await db.getDB()
                                               .collection('Meta')
                                               .findOne({name:element.name},async (err,out)=>{
                                                    if(err) console.log(err);
                                                    else{
                                                        if(out){
                                                            out['exp'] = ex;
                                                            await db.getDB()
                                                                    .collection(element.name)
                                                                    .save(out,(err,res)=>{
                                                                      if(err) console.log(err);
                                                                      else{
                                                                          console.log(`success ${element.name}`);
                                                                      }
                                                                    });
                                                        }
                                                    }
                                               });
                                   }
                                 });
                     }
                 });
              }
          });
    }
});