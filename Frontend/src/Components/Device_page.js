import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
   KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {Grid,AppBar,Divider,Card} from '@material-ui/core';
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
import Button from '@material-ui/core/Button';
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
handleSecChange1 = () => {
  this.setState({ 
    url1: `http://localhost:4000/Kolkata/exp/${this.state.sec}/?date=${this.state.date}&type=EI`,
    url1_1:`http://localhost:4000/Kolkata/res_donut/?date=${this.state.date}&type=EI`,
    url1_2:`http://localhost:4000/Kolkata/top_and_least/?date=${this.state.date}&type=EI`,
    url1_3:`http://localhost:4000/Kolkata/res/${this.state.sec}/?date=${this.state.date}&type=EI`
 });
  
}

handleSecChange2 = () => {
  this.setState({ 
    url2:`http://localhost:4000/Kolkata/exp_series/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,
    url2_1:`http://localhost:4000/Kolkata/allRes_TS/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,
    url2_2:`http://localhost:4000/Kolkata/exp_till_date/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,
    url2_3:`http://localhost:4000/Kolkata/top_least_timeseries/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`,
    url2_4:`http://localhost:4000/Kolkata/restime/${this.state.sec_t}/?sdate=${this.state.sdate}&edate=${this.state.edate}&type=EI`
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
  gridContainer: {
    paddingLeft: "40px",
    paddingRight: "40px"
  },
   
  
  
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
                        
                        <iframe src={this.state.url1_3} width="50%" height="500" title="res" id="ifm" frameborder="0"></iframe>                                      
                          
                        <iframe src={this.state.url1_1} width="50%" height="500" title="res_donut" id="ifm" frameborder="0"></iframe>
                       
                  
                        <iframe src={this.state.url1_2} width="50%" height="550" title="top_and_least" id="ifm" frameborder="0"></iframe>
                           
                        <iframe src={this.state.url1} width="50%" height="550" title="exp" id="ifm"frameborder="0"></iframe>
                           
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
                     <iframe src={this.state.url2_1} width="50%" height="500" title="allRes_TS" id="ifm" frameborder="0"></iframe>
                      <iframe src={this.state.url2_2} width="50%" height="500" title="exp_till_date" id="ifm" frameborder="0"></iframe>
                      <iframe src={this.state.url2_3} width="75%" height="500" title="top_least_timeseries" id="ifm" frameborder="0"></iframe>
                      <iframe src={this.state.url2_4} width="50%" height="500" title="restime" id="ifm" frameborder="0"></iframe>
                       <iframe src={this.state.url2} width="50%" height="500" title="exp_series" id="ifm" frameborder="0"></iframe>
                </TabPanel>
           
      
      
       </div>
      </Container>
    )
  }
}
export default SimpleTabs;