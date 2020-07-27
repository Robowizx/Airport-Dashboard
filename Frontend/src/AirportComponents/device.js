import React, {Component } from 'react';//importing DB module
// const db = require("../db");

//importing moment for date computation
const moment = require("moment-timezone");

export default class Device extends Component{
  constructor(props){
    super(props)
    this.state= {
      sdate: moment().subtract(10, "days").format("YYYY-MM-DD"),
      edate: moment().format("YYYY-MM-DD"),
      types: [],
      type:""
  
    }; 
    this.state={
      ...this.state,
      url :`http://localhost:4000/Kolkata/spark_donut/${this.state.type}/?date=${this.state.sdate}`,
    };
  this.state={
    ...this.state,
    url1:`http://localhost:4000/Kolkata/spark_line/${this.state.type}/?sdate=${this.state.sdate}&edate=${this.state.edate}`
  }};
    componentDidMount=()=>{
      this.getTypeList();
    };


    getTypeList(){
      const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };      
      fetch(`http://localhost:4000/Kolkata/devicelist/?date=${this.state.sdate}`,{method:"GET",headers:header})
      .then((response)=>{
        const data=response.data;
        // const devices= data.forEach((d) => {
        // types.push(d.type);
        // });
        this.setState=({types:data});
        console.log("list of devices fetched",data)
      })
      .catch((error)=>{
        console.log("error");
      });
    
    };
    displayTypeList=(types)=>{
      if(!types.length)return null;
      return types.map((type,index)=>(
        <div key={index}>
        
         <p>{type}</p>
         
        </div>
        )
  );     

    }   
    
  
  render(){
    return(
      <div>
      <div className="displayType">
     {this.displayTypeList (this.state.types)}
      </div>
      </div>
     

    )
      
    }
  };





