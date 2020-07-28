import React, { Component } from 'react';
import { request,GraphQLClient } from 'graphql-request'
const moment = require("moment-timezone");


export default class Device extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            airport:"Kolkata",
            ddate: moment().format("YYYY-MM-DD"),
            sddate:moment().subtract(10, "days").format("YYYY-MM-DD"),
            type:"",
            data:[]
        };
         this.state = {
                ...this.state,
            ur1:`https://localhost:4000/Kolkata/spark_donut/${this.state.type}?date=${this.state.ddate}`,
            url2:`https://localhost:4000/Kolkata/spark_line/${this.state.type}?sdate=${this.state.sddate}&edate=${this.state.ddate}`
         };

         const endpoint = 'https://localhost:4000/graphql'
         const authToken =
           "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
         const header = {
           Authorization: "Basic " + authToken};
         const query = `
            query($name:String!,$date:String!){
                 airport_name(name:$name,date:$date){
                   num_of_devs
                   devices{
                     name
                  
                   }
                 }
                 }  ` 
        const params={name:`${this.state.airport}`, date:`${this.state.ddate}`}

         request(endpoint, query,params)
         .then((data => {
            console.log(data);          
            const noOfDevices=data.data.airport_name.num_of_devs;                    
            console.log(noOfDevices);
            var devicelist;
             data.data.airport_name.devices.forEach(device =>{
            devicelist.push(device.name);//for spark lines
             const trow=document.createElement("TR") ;
             trow.setAttribute("id", "myTr");
             document.getElementById("Dlist").appendChild(trow);
             var y = document.createElement("TD");
             var t = document.createTextNode(device.name);
             y.appendChild(t);
             document.getElementById("myTr").appendChild(y);
             }) 
             })    
         )
            }
        handleDateChange=date=>{
            var ddates=moment.format("YYYY-MM-DD");
            var sddates=moment().subtract(10, "days").format("YYYY-MM-DD"),
            this.setState=({
                ddate:ddates,
                sddate:sddates
            })
            this.getContent(`https://localhost:4000/Kolkata/spark_donut/${this.state.type}?date=${ddates}`),
            this.getContent(`https://localhost:4000/Kolkata/spark_line/${this.state.type}?sdate=${sddates}&edate=${this.state.ddate}`)
        }; 
        
        getContent(url1, idChart) {
            console.log('URL: '+url1)
            const authToken =
              "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
            const header = {
              Authorization: "Basic " + authToken,
            };
            const iframe = document.getElementById(idChart);
            fetch(url1, { method: "GET", headers: header })
              .then((response) => response.text())
              .then((data) => {
                iframe.contentDocument.write(data);
                iframe.contentDocument.close();
              })
              .catch((error) => {
                console.log(error);
              });
            }
              let tc=devicelist.map(typeChange);
              function typeChange(eachType){
                this.getContent(`https://localhost:4000/Kolkata/spark_donut/${eachType}?date=${this.state.ddate}`),
                this.getContent(`https://localhost:4000/Kolkata/spark_line/${eachType}?sdate=${this.state.sddate}&edate=${this.state.ddate}`)

              }
          
        //    async function getDevicesList() {            
           
        //       const endpoint = 'https://localhost:4000/graphql'
        //       const authToken =
        //         "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
        //       const header = {
        //         Authorization: "Basic " + authToken};
        //         const graphQLClient = new GraphQLClient(endpoint, {
        //             headers: header
        //           })
        //     const query = `
        //       query($name:String!,$date:String!){
        //         airport_name(name:$name,date:$date){
        //           num_of_devs
        //           devices{
        //             name
                  
        //           }
        //         }
        //         }  ` 
        //         const variables={name:`${this.state.airport}`, date:`${this.state.ddate}`}
        //         const data = await graphQLClient.request(query,variables)
        //         console.log(JSON.stringify(data)) 
        //         .then(data=>{
        //             console.log(data);
                    // const noOfDevices=data.data.airport_name.num_of_devs;                    
                    // console.log(noOfDevices);
                    // var devicelist;
                    //  data.data.airport_name.devices.forEach(device =>{
                    // devicelist.push(device.name);//for spark lines
                    //  const trow=document.createElement("TR") ;
                    //  trow.setAttribute("id", "myTr");
                    //  document.getElementById("Dlist").appendChild(trow);
                    //  var y = document.createElement("TD");
                    //  var t = document.createTextNode(device.name);
                    //  y.appendChild(t);
                    //  document.getElementById("myTr").appendChild(y);
                    //  }) 
                    //  })         
               
        //             .catch((error) => console.error(error))
        //         } 
        //     }


            render() { 
            return (
                <div><table id="Dlist"></table>
                <iframe id="ifm1"></iframe>
                <iframe id="ifm2"></iframe>
              </div>
            );      
        }
    }
     
