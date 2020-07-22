import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib


import {
   KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import {Grid,AppBar,Divider,Toolbar} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TodayIcon from '@material-ui/icons/Today';
import TimelineIcon from '@material-ui/icons/Timeline';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CssBaseline from '@material-ui/core/CssBaseline';
const moment = require('moment-timezone');

class Time extends Component{
  constructor(props){
    super(props);
    this.state = {
      airport:"",
      sec:"by_device",
      type:"",
      date: moment().subtract(3, "days"),
      edate: moment().format('YYYY-MM-DD'),
      value:1
  };
  
}
handleDateChange = date => {
    var dates = moment(date).format('YYYY-MM-DD');
  this.setState({ 
    date: dates,
 });
  console.log(this.state);
  this.getContent(`https://localhost:4000/Kolkata/exp_series/${this.state.sec}/?sdate=${dates}&edate=${this.state.edate}&type=EI`,"ifm1");
  this.getContent(`https://localhost:4000/Kolkata/allRes_TS/?sdate=${dates}&edate=${this.state.edate}&type=EI`,"ifm2");
  this.getContent(`https://localhost:4000/Kolkata/exp_till_date/?sdate=${dates}&edate=${this.state.edate}&type=EI`,"ifm3");
  this.getContent(`https://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec}/?sdate=${dates}&edate=${this.state.edate}&type=EI`,"ifm4")
  this.getContent(`https://localhost:4000/Kolkata/restime/${this.state.sec}/?sdate=${dates}&edate=${this.state.edate}&type=EI`,"ifm5");
}
handleChange = event => {
    var section = (event.target.value);
  this.setState({ 
    sec: section,
 });
  console.log(this.state);
   this.getContent(`https://localhost:4000/Kolkata/exp_series/${section}/?sdate=${this.state.date}&edate=${this.state.edate}&type=EI`,"ifm1");
  this.getContent(`https://localhost:4000/Kolkata/allRes_TS/?sdate=${this.state.date}&edate=${this.state.edate}&type=EI`,"ifm2");
  this.getContent(`https://localhost:4000/Kolkata/exp_till_date/?sdate=${this.state.date}&edate=${this.state.edate}&type=EI`,"ifm3");
  this.getContent(`https://localhost:4000/Kolkata/top_least_timeseries/${section}/?sdate=${this.state.date}&edate=${this.state.edate}&type=EI`,"ifm4")
  this.getContent(`https://localhost:4000/Kolkata/restime/${section}/?sdate=${this.state.date}&edate=${this.state.edate}&type=EI`,"ifm5");
  
}
handleDateChange1 = date => {
    var dates = moment(date).format('YYYY-MM-DD');
  this.setState({ 
    edate: dates,
 });
  console.log(this.state);
   this.getContent(`https://localhost:4000/Kolkata/exp_series/${this.state.sec}/?sdate=${this.state.date}&edate=${dates}&type=EI`,"ifm1");
  this.getContent(`https://localhost:4000/Kolkata/allRes_TS/?sdate=${this.state.date}&edate=${dates}&type=EI`,"ifm2");
  this.getContent(`https://localhost:4000/Kolkata/exp_till_date/?sdate=${this.state.date}&edate=${dates}&type=EI`,"ifm3");
  this.getContent(`https://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec}/?sdate=${this.state.date}&edate=${dates}&type=EI`,"ifm4")
  this.getContent(`https://localhost:4000/Kolkata/restime/${this.state.sec}/?sdate=${this.state.date}&edate=${dates}&type=EI`,"ifm5");
  
}
handleClose = () => {
    this.setState({open:false});
    }
    handleOpen = () => {
    this.setState({open:true});
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
   this.getContent(`https://localhost:4000/Kolkata/exp_series/${this.state.sec}/?sdate=${this.state.date.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,"ifm1");
  this.getContent(`https://localhost:4000/Kolkata/allRes_TS/?sdate=${this.state.date.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,"ifm2");
  this.getContent(`https://localhost:4000/Kolkata/exp_till_date/?sdate=${this.state.date.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,"ifm3");
  this.getContent(`https://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec}/?sdate=${this.state.date.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,"ifm4")
  this.getContent(`https://localhost:4000/Kolkata/restime/${this.state.sec}/?sdate=${this.state.date.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,"ifm5");
  }
  handleValueChange = (event, newValue) => {
    
    this.setState({value:newValue});
  };

render(){
  
  
  

    return(
     <div>
       <CssBaseline />
        <AppBar position='fixed' color="inherit">
           <Toolbar>
           </Toolbar>
             
              
              <Grid   container
  direction="row"
  justify="space-around"
  alignItems="center"
>                                                              
                     <Tabs 
                      value={this.state.value}
    indicatorColor="primary"
    textColor="primary"
    onChange={this.handleValueChange}
    aria-label="disabled tabs example">
                  <Tab label="Daily"  icon={<TodayIcon />} />
                  <Tab label="Time Series"  icon={<TimelineIcon />} disabled/>
         
               </Tabs>

                         <FormControl >
                              <InputLabel id="demo-controlled-open-select-label">Section</InputLabel>
                               <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={this.state.open}
                                onClose={this.handleClose}
                                onOpen={this.handleOpen}
                                value={this.state.sec}
                                onChange={this.handleChange }
                               >
         
                                  <MenuItem value={"by_device"}>By device</MenuItem>
                                  <MenuItem value={"by_survey"}>By survey</MenuItem>
                                  <MenuItem value={"by_group"}>By group</MenuItem>
                              </Select>
                        </FormControl>
                   

                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                  margin="normal"
                                  id="date-picker-dialog"
                                  label="Date"
                                  format="yyyy-MM-dd"
                                  value={this.state.date}
                                  onChange={this.handleDateChange }
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}
                                />
                          </MuiPickersUtilsProvider>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                  margin="normal"
                                  id="date-picker-dialog"
                                  label="Date"
                                  format="yyyy-MM-dd"
                                  value={this.state.edate}
                                  onChange={this.handleDateChange1 }
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}
                                />
                          </MuiPickersUtilsProvider>
                         
                         </Grid>
                         </AppBar> 
                         <Toolbar>
                         </Toolbar> 
                         <Divider/>
                          <Container style={{paddingtop:"50px"}}>
       
        
                          
        <iframe width="50%" height="550" title="res_donut" id="ifm2" frameBorder="0"></iframe>
        
        <iframe  width="50%" height="550" title="top_and_least" id="ifm3" frameBorder="0"></iframe>
            
        <iframe  width="75%" height="550" title="res" id="ifm4" frameBorder="0"></iframe>
        <iframe  width="50%" height="550" title="res" id="ifm5" frameBorder="0"></iframe>
       <iframe  width="50%" height="550" title="exp" id="ifm1" frameBorder="0"></iframe> 
      </Container>
      </div>
    )
  }
}
export default Time;
