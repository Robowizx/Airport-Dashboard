import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import Buttons from '@material-ui/core/Button';
const moment = require('moment-timezone');

class Device extends Component{
  constructor(props){
    super(props);
    this.state = {
      airport:"",
      sec:"by_device",
      type:"",
      date: moment().format('YYYY-MM-DD')
  };
  this.state = {...this.state, 
    url1:`http://localhost:4000/Kolkata/exp/${this.state.sec}/?date=${this.state.date}&type=EI`,
    url2:`https://localhost:4000/Kolkata/res_donut/?date=${this.state.date}&type=EI`,
    url3:`https://localhost:4000/Kolkata/top_and_least/?date=${this.state.date}&type=EI`,
    url4:`https://localhost:4000/Kolkata/res/${this.state.sec}/?date=${this.state.date}&type=EI`,
    url5:`https://localhost:4000/Kolkata/exp_series/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,
    url6:`https://localhost:4000/Kolkata/allRes_TS/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,
    url7:`https://localhost:4000/Kolkata/exp_till_date/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,
    url8:`https://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,
    url9:`https://localhost:4000/Kolkata/restime/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`
}
}
handleDateChange = date => {
    var dates = moment(date).format('YYYY-MM-DD');
  this.setState({ 
    date: dates,
 });
  console.log(this.state);
  this.getContent(`https://localhost:4000/Kolkata/exp/${this.state.sec}/?date=${dates}&type=EI`,"ifm1");
  this.getContent(`https://localhost:4000/Kolkata/top_and_least/?date=${dates}&type=EI`,"ifm2");
  this.getContent(`https://localhost:4000/Kolkata/top_and_least/?date=${dates}&type=EI`,"ifm3");
  this.getContent(`https://localhost:4000/Kolkata/res/${this.state.sec}/?date=${dates}&type=EI`,"ifm4");
}


getContent(url1,idChart) {
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


componentDidMount(){
    this.getContent(`https://localhost:4000/Kolkata/exp/${this.state.sec}/?date=${this.state.date}&type=EI`,"ifm1");
    this.getContent(`https://localhost:4000/Kolkata/res_donut/?date=${this.state.date}&type=EI`,"ifm2");
    this.getContent(`https://localhost:4000/Kolkata/top_and_least/?date=${this.state.date}&type=EI`,"ifm3");
    this.getContent(`https://localhost:4000/Kolkata/res/${this.state.sec}/?date=${this.state.date}&type=EI`,"ifm4");
  }


render(){
    return(
      <Container style={{paddingtop:"50px"}}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker value={this.state.date || Date.now()} onChange={this.handleDateChange} format="yyyy-MM-dd"/>
        </MuiPickersUtilsProvider>
        <iframe  width="50%" height="500" title="exp" id="ifm1" ></iframe> 
                          
        <iframe width="50%" height="500" title="res_donut" id="ifm2" ></iframe>
        
        <iframe  width="50%" height="550" title="top_and_least" id="ifm3" ></iframe>
            
        <iframe  width="50%" height="550" title="res" id="ifm4" ></iframe>
      </Container>
    )
  }
}
export default Device;