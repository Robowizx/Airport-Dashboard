import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
   KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {Grid,AppBar,Divider} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TodayIcon from '@material-ui/icons/Today';
import TimelineIcon from '@material-ui/icons/Timeline';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import CssBaseline from '@material-ui/core/CssBaseline';


const moment = require('moment-timezone');

class SimpleTabs extends Component{
  constructor(props){
    super(props);
    this.state = {
      sec:"by_device",
       sec_t:"by_device",
      value:0,
      open:false,
      date:moment().format('YYYY-MM-DD'),
      sdate: moment().subtract(3, "days"),
      edate:moment().format('YYYY-MM-DD')
  };
  this.state = {...this.state, url1:`http://localhost:4000/Kolkata/exp/${this.state.sec}/?date=${this.state.date}&type=EI`}
  this.state = {...this.state, url1_1:`http://localhost:4000/Kolkata/res_donut/?date=${this.state.date}&type=EI`}
  this.state = {...this.state, url1_2:`http://localhost:4000/Kolkata/top_and_least/?date=${this.state.date}&type=EI`}
  this.state = {...this.state, url1_3:`http://localhost:4000/Kolkata/res/${this.state.sec}/?date=${this.state.date}&type=EI`}
  this.state = {...this.state, url2:`http://localhost:4000/Kolkata/exp_series/${this.state.sec_t}/?sdate=${this.state.sdate.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`}
  this.state = {...this.state, url2_1:`http://localhost:4000/Kolkata/allRes_TS/?sdate=${this.state.sdate.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`}
  this.state = {...this.state, url2_2:`http://localhost:4000/Kolkata/exp_till_date/?sdate=${this.state.sdate.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`}
  this.state = {...this.state, url2_3:`http://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec_t}/?sdate=${this.state.sdate.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`}
   this.state = {...this.state, url2_4:`http://localhost:4000/Kolkata/restime/${this.state.sec_t}/?sdate=${this.state.sdate.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`}


}
handleDateChange = date => {
  this.setState({ 
   date:moment(date).format('YYYY-MM-DD'),
     url1: `http://localhost:4000/Kolkata/exp/${this.state.sec}/?date=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url1_1:`http://localhost:4000/Kolkata/res_donut/?date=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url1_2:`http://localhost:4000/Kolkata/top_and_least/?date=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url1_3:`http://localhost:4000/Kolkata/res/${this.state.sec}/?date=${moment(date).format('YYYY-MM-DD')}&type=EI`
 });
  
}
handleDateChange1 = date => {
  this.setState({ 
    sdate:moment(date).format('YYYY-MM-DD'),
     url2:`http://localhost:4000/Kolkata/exp_series/${this.state.sec_t}/?sdate=${moment(date).format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
    url2_1:`http://localhost:4000/Kolkata/allRes_TS/?sdate=${moment(date).format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
    url2_2:`http://localhost:4000/Kolkata/exp_till_date/?sdate=${moment(date).format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
    url2_3:`http://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec_t}/?sdate=${moment(date).format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
    url2_4:`http://localhost:4000/Kolkata/restime/${this.state.sec_t}/?sdate=${moment(date).format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`
 });
  
}
handleDateChange2 = date => {
  this.setState({ 
    edate:moment(date).format('YYYY-MM-DD'),
    url2:`http://localhost:4000/Kolkata/exp_series/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url2_1:`http://localhost:4000/Kolkata/allRes_TS/?sdate=${this.state.sdate}&edate=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url2_2:`http://localhost:4000/Kolkata/exp_till_date/?sdate=${this.state.sdate}&edate=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url2_3:`http://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url2_4:`http://localhost:4000/Kolkata/restime/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${moment(date).format('YYYY-MM-DD')}&type=EI`

 });
  
}
 handleChange = (event) => {
   this.setState({ 
    sec:(event.target.value),
    url1: `http://localhost:4000/Kolkata/exp/${(event.target.value)}/?date=${this.state.date}&type=EI`,
  url1_3:`http://localhost:4000/Kolkata/res/${(event.target.value)}/?date=${this.state.date}&type=EI`
  });
  }
   handleChange_t = (event) => {
    this.setState({ 
       sec_t:(event.target.value),
     url2:`http://localhost:4000/Kolkata/exp_series/${(event.target.value)}/?sdate=${this.state.sdate.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
   
    url2_3:`http://localhost:4000/Kolkata/top_least_timeseries/${(event.target.value)}/?sdate=${this.state.sdate.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
    url2_4:`http://localhost:4000/Kolkata/restime/${(event.target.value)}/?sdate=${this.state.sdate.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`
    });
  }

handleClose = () => {
    this.setState({open:false});
  };

   handleOpen = () => {
    this.setState({open:true});
  };
  handleChange1 = (event, newValue) => {
    this.setState({value:newValue});
  };
  componentDidMount1(){
    this.getContent1(`http://localhost:4000/Kolkata/exp/${this.state.sec}/?date=${this.state.date}&type=EI`);
  }
  componentDidMount2(){
    this.getContent2(`http://localhost:4000/Kolkata/res_donut/?date=${this.state.date}&type=EI`);
  }
  componentDidMount3(){
    this.getContent3(`http://localhost:4000/Kolkata/top_and_least/?date=${this.state.date}&type=EI`);
  }
  componentDidMount4(){
    this.getContent4(`http://localhost:4000/Kolkata/res/${this.state.sec}/?date=${this.state.date}&type=EI`);
  }
  componentDidMount5(){
    this.getContent5(`http://localhost:4000/Kolkata/exp_series/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`);
  }
  componentDidMount6(){
    this.getContent6(`http://localhost:4000/Kolkata/allRes_TS/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`);
  }
  componentDidMount7(){
    this.getContent7(`http://localhost:4000/Kolkata/exp_till_date/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`);
  }
  componentDidMount8(){
    this.getContent8(`http://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`);
  }
  componentDidMount9(){
    this.getContent9(`http://localhost:4000/Kolkata/restime/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`);
  }
  getContent1(url1) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById("ifm1");
    fetch(url1, { method: "GET", headers: header })
      .then((response) => response.text())
      .then((data) => { iframe.contentDocument.write(data); })
      .catch((error) => {
        console.log(error);
      });
  }
   getContent2(url1_1) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById("ifm2");
    fetch(url1_1, { method: "GET", headers: header })
      .then((response) => {
        iframe.write(response.text());
      })
       .then((data) => { iframe.contentDocument.write(data); })
      .catch((error) => {
        console.log(error);
      });
  }
   getContent3(url1_2) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById("ifm3");
    fetch(url1_2, { method: "GET", headers: header })
      .then((response) => {
        iframe.write(response.text());
      })
       .then((data) => { iframe.contentDocument.write(data); })
      .catch((error) => {
        console.log(error);
      });
  }
   getContent4(url1_3) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById("ifm4");
    fetch(url1_3, { method: "GET", headers: header })
      .then((response) => {
        iframe.write(response.text());
      })
       .then((data) => { iframe.contentDocument.write(data); })
      .catch((error) => {
        console.log(error);
      });
  }
   getContent5(url2) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById("ifm5");
    fetch(url2, { method: "GET", headers: header })
      .then((response) => {
        iframe.write(response.text());
      })
       .then((data) => { iframe.contentDocument.write(data); })
      .catch((error) => {
        console.log(error);
      });
  }
   getContent6(url2_1) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById("ifm6");
    fetch(url2_1, { method: "GET", headers: header })
      .then((response) => {
        iframe.write(response.text());
      })
       .then((data) => { iframe.contentDocument.write(data); })
      .catch((error) => {
        console.log(error);
      });
  }
   getContent7(url2_2) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById("ifm7");
    fetch(url2_2, { method: "GET", headers: header })
      .then((response) => {
        iframe.write(response.text());
      })
       .then((data) => { iframe.contentDocument.write(data); })
      .catch((error) => {
        console.log(error);
      });
  }
   getContent8(url2_3) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById("ifm8");
    fetch(url2_3, { method: "GET", headers: header })
      .then((response) => {
        iframe.write(response.text());
      })
       .then((data) => { iframe.contentDocument.write(data); })
      .catch((error) => {
        console.log(error);
      });
  }
   getContent9(url2_4) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById("ifm9");
    fetch(url2_4, { method: "GET", headers: header })
      .then((response) => {
        iframe.write(response.text());
      })
       .then((data) => { iframe.contentDocument.write(data); })
      .catch((error) => {
        console.log(error);
      });
  }
render(){
   
  function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  
   button: {
    display: 'block',
     ml:theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
 card: {
      width: "50px",
      height: "222px"
    }
  
  
}));

    return(
      <Container style={{paddingtop:"50px"}}>
        <div >
         <CssBaseline />
        <AppBar position='relative' color="inherit">
           
               <Tabs value={this.state.value} onChange={this.handleChange1} aria-label="simple tabs example">
                  <Tab label="Daily"  icon={<TodayIcon />} {...a11yProps(0)} />
                  <Tab label="Time Series"  icon={<TimelineIcon />}{...a11yProps(1)} />
         
               </Tabs>
              </AppBar>  
                    <TabPanel value={this.state.value} index={0}>
                     <Grid  container spacing={3}>                                                               
                      <Grid item xs={12} sm={6}>
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
                    </Grid>
                          <Grid item xs={12} sm={6}>

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
                          
                         </Grid>
                         </Grid>
                         <Divider/>
                      

                        <iframe  width="50%" height="500" title="exp" id="ifm1" frameborder="0"></iframe> 
                                                          
                          
                        <iframe width="50%" height="500" title="res_donut" id="ifm2" frameborder="0"></iframe>
                       
                       
                        <iframe  width="50%" height="550" title="top_and_least" id="ifm3" frameborder="0"></iframe>
                           
                        <iframe  width="50%" height="550" title="res" id="ifm4" frameborder="0"></iframe>
                           
                    </TabPanel>
       
                    <TabPanel value={this.state.value} index={1}>
                         <Grid container spacing={3}>                
                            <Grid item xs={12} sm={6} >                 
                      
                              <FormControl className={useStyles.formControl}>
                              <InputLabel id="demo-controlled-open-select-label">Section</InputLabel>
                              <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={this.state.open}
                                onClose={this.handleClose}
                                onOpen={this.handleOpen}
                                value={this.state.sec_t}
                                onChange={this.handleChange_t}
                              >
        
                                    <MenuItem value={"by_device"}>By device</MenuItem>
                                    <MenuItem value={"by_survey"}>By survey</MenuItem>
                                    <MenuItem value={"by_group"}>By group</MenuItem>
                              </Select>
                         </FormControl>
                           </Grid>

                      <Grid item xs={12} sm={6}>
                         <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                              margin="normal"
                              id="date-picker-dialog"
                              label="Start Date"
                              format="yyyy-MM-dd"
                              value={this.state.sdate}
                              onChange={this.handleDateChange1}
                              KeyboardButtonProps={{
                                'aria-label': 'change date',
                              }}
                            />
         
                            <KeyboardDatePicker
                              margin="normal"
                              id="date-picker-dialog"
                              label="End Date"
                              format="yyyy-MM-dd"
                              value={this.state.edate}
                              onChange={this.handleDateChange2}
                              KeyboardButtonProps={{
                                'aria-label': 'change date',
                              }}
                            />
                           
                      </MuiPickersUtilsProvider>
                      
                   </Grid> 
                   </Grid>
                    <Divider/>
                     <iframe  width="50%" height="500" title="exp_series" id="ifm5" frameborder="0"></iframe>
                      <iframe  width="50%" height="500" title="allRes_TS" id="ifm6" frameborder="0"></iframe>
                      <iframe  width="75%" height="500" title="exp_till_date" id="ifm7" frameborder="0"></iframe>
                      <iframe  width="50%" height="500" title="top_least_timeseries" id="ifm8" frameborder="0"></iframe>
                       <iframe  width="50%" height="500" title="restime" id="ifm9" frameborder="0"></iframe>
                </TabPanel>
           
      
      
       </div>
      </Container>
    )
  }
}
export default SimpleTabs;