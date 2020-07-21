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
      date:"2020-03-04",
      sdate: "2020-03-04",
      edate:"2020-03-06"
  };
}
 componentDidMount(){
    this.getContent(`https://localhost:4000/Kolkata/exp/${this.state.sec}/?date=${this.state.date}&type=EI`,"ifm1");
    this.getContent(`https://localhost:4000/Kolkata/res_donut/?date=${this.state.date}&type=EI`,"ifm2");
     this.getContent(`https://localhost:4000/Kolkata/top_and_least/?date=${this.state.date}&type=EI`,"ifm3");

    this.getContent(`https://localhost:4000/Kolkata/res/${this.state.sec}/?date=${this.state.date}&type=EI`,"ifm4");

  //   this.getContent(`https://localhost:4000/Kolkata/exp_series/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,"ifm5");
 
  //    this.getContent(`https://localhost:4000/Kolkata/allRes_TS/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,"ifm6");

  //   this.getContent(`https://localhost:4000/Kolkata/exp_till_date/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,"ifm7");

  //   this.getContent(`https://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,"ifm8");

  
  //   this.getContent(`https://localhost:4000/Kolkata/restime/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,"ifm9");
  }
  getContent(url1,idChart) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById(idChart);
    fetch(url1, { method: "GET", headers: header })
      .then((response) => response.text())
      .then((data) => { iframe.contentDocument.write(data); })
      .catch((error) => {
        console.log(error);
      });
  }
handleDateChange = date => {
  this.setState({ 
   date:moment(date).format('YYYY-MM-DD'),
     url1: `https://localhost:4000/Kolkata/exp/${this.state.sec}/?date=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url1_1:`https://localhost:4000/Kolkata/res_donut/?date=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url1_2:`https://localhost:4000/Kolkata/top_and_least/?date=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url1_3:`https://localhost:4000/Kolkata/res/${this.state.sec}/?date=${moment(date).format('YYYY-MM-DD')}&type=EI`
 });
  
}
handleDateChange1 = date => {
  this.setState({ 
    sdate:moment(date).format('YYYY-MM-DD'),
     url2:`https://localhost:4000/Kolkata/exp_series/${this.state.sec_t}/?sdate=${moment(date).format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
    url2_1:`https://localhost:4000/Kolkata/allRes_TS/?sdate=${moment(date).format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
    url2_2:`https://localhost:4000/Kolkata/exp_till_date/?sdate=${moment(date).format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
    url2_3:`https://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec_t}/?sdate=${moment(date).format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
    url2_4:`https://localhost:4000/Kolkata/restime/${this.state.sec_t}/?sdate=${moment(date).format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`
 });
  
}
handleDateChange2 = date => {
  this.setState({ 
    edate:moment(date).format('YYYY-MM-DD'),
    url2:`https://localhost:4000/Kolkata/exp_series/${this.state.sec}/?sdate=${this.state.sdate}&edate=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url2_1:`https://localhost:4000/Kolkata/allRes_TS/?sdate=${this.state.sdate}&edate=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url2_2:`https://localhost:4000/Kolkata/exp_till_date/?sdate=${this.state.sdate}&edate=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url2_3:`https://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${moment(date).format('YYYY-MM-DD')}&type=EI`,
    url2_4:`https://localhost:4000/Kolkata/restime/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${moment(date).format('YYYY-MM-DD')}&type=EI`

 });
  
}
 handleChange = (event) => {
   this.setState({ 
    sec:(event.target.value),
    url1: `https://localhost:4000/Kolkata/exp/${(event.target.value)}/?date=${this.state.date}&type=EI`,
  url1_3:`https://localhost:4000/Kolkata/res/${(event.target.value)}/?date=${this.state.date}&type=EI`
  });
  }
   handleChange_t = (event) => {
    this.setState({ 
       sec_t:(event.target.value),
     url2:`https://localhost:4000/Kolkata/exp_series/${(event.target.value)}/?sdate=${this.state.sdate.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
    url2_3:`https://localhost:4000/Kolkata/top_least_timeseries/${(event.target.value)}/?sdate=${this.state.sdate.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`,
    url2_4:`https://localhost:4000/Kolkata/restime/${(event.target.value)}/?sdate=${this.state.sdate.format('YYYY-MM-DD')}&edate=${this.state.edate}&type=EI`
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