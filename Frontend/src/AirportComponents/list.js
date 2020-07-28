import React, { Component } from 'react';

const moment = require("moment-timezone");


class List extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            airport:"Kolkata",
            ddate: moment().format("YYYY-MM-DD"),
            eddate:moment().subtract(10, "days").format("YYYY-MM-DD"),
            type:"",
        };
         this.state = {
                ...this.state,
            ur1:`https://localhost:4000/Kolkata/spark_donut/${this.state.type}?date=${this.state.ddate}`,
            url2:`https://localhost:4000/Kolkata/spark_line/${this.state.type}?sdate=${this.state.eddate}&edate=${this.state.ddate}`
         }   
            var name=`${this.state.airport}`
            var date=`${this.state.ddate}`
         getDeviceList(name,date,            
            `query getDevices($name:String!,$date:String!) {
             airport_name(name:$name,date:$date){
             num_of_devs
             devices{
               name
             
             }
           }
           }  `    
       ).then(data=>{
        const noOfDevices=data.data.airport_name.num_of_devs;
        console.log(data);
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
        
       
        function getDeviceList(query,name,date) {
        const authToken =
        "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
        const header = {
        Authorization: "Basic " + authToken,
        };
        return fetch('https://localhost:4000/graphql',{ 
        method: "POST",
        headers: header,
        body:JSON.stringify({
        query:query,
        variables:{name,date}
     
        }) })
        .then((response) => response.json())
        
    }
    }
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
   
 
    render() { 
        return (
            <div><table id="Dlist"></table>
            <iframe id="ifm1"></iframe>
            <iframe id="ifm2"></iframe>
          </div>
        );      
    }
}
 
export default List;