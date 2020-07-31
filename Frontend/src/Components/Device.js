import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, Divider} from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {request} from 'graphql-request';
import moment from 'moment';
import Daily from './Daily';
import TimeSeries from './TimeSeries';

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
  root: {
    flexGrow: 1,
    backgroundColor:'#424242',
  },
  root1: {
    
    backgroundColor:'#424242',
  },
  MenuItem: {
    color: "white"
  },
  sticky:{
    position:'fixed',
    height:'12.0%',
    width:'95.65%',
    backgroundColor:'#424242',
    top:'6.5%',
    right:'0',
    zIndex:2
}


}));

export default function Device(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [open, setState] = React.useState();
  const [sec, setSec] = React.useState("by_device");
  const [type, setType] = React.useState(props.type);
  const [change, setChange] = React.useState(true);
  const [state, setData] = React.useState([])
  const prevState = usePrevious(state)
  const query = `
  query($name:String!,$date:String!){
    airport_name (name:$name,date:$date){
      devices {
        device_name
        avg_exp_index
        exp
        rank
        avg_imp_index
      }
    }
  }
  `

  function usePrevious(value) {
    const ref = React.useRef();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  React.useEffect(() => {
    var pick = moment().format('yyyy-MM-DD')
    const variables = {
      "name": "Kolkata",
      "date": pick
    }
    if( prevState !== state){
      request(`https://localhost:4000/graphql`, query, variables)
      .then(data => {
        setData(data.airport_name.devices);
      })
      .catch((err)=>{
        console.log(err);
      })
    }
  }, [])

  const handleChartChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setState(false);
    setChange(false);
    }
  const handleOpen = () => {
    setState(true);
    setChange(false);
  }
  const handleSecChange = (event)=>{
    if(event.target.value != sec){
      setSec(event.target.value);
      setChange(true);
    }
  }
  const handleDevChange = (event) =>{
    if(event.target.value != type){
      setType(event.target.value);
      setChange(true);
    }
  }

  return (
    <React.Fragment >  
      <div className={classes.sticky}> 
    <Typography variant="h2" style={{textAlign:'center',paddingTop:'2%',paddingLeft:'5%'}}>{props.air+" Airport"}</Typography>
             
           
    <div className={classes.root} style={{marginTop:'-4.5%'}}>
        <Grid className={classes.root1} container spacing={2}>
          <Grid item  xs={4} style={{paddingLeft:"25px", paddingRight:"25px",paddingTop:"25px"}}>
              <FormControl >
                <Grid container direction="row" spacing={2} >
                  <Grid item>
                    <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={sec}
                    onChange={handleSecChange }
                    >

                      <MenuItem value={"by_device"}>By device</MenuItem>
                      <MenuItem value={"by_survey"}>By survey</MenuItem>
                      <MenuItem value={"by_group"}>By group</MenuItem>
                  </Select>
                  </Grid>
                  <Grid item>
                    <Select
                    labelId="demo"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={type}
                    onChange={handleDevChange }
                    >
                      {
                        state.map((dev)=>(
                        <MenuItem value={dev.device_name}>{dev.device_name}</MenuItem>
                        ))
                      }
                  </Select>
                  </Grid>
                  </Grid>
            </FormControl>
          </Grid>
          <Grid item xs={5}></Grid>
          <Grid item xs={2} alignItems="flex-end">
           <Tabs value={value} onChange={handleChartChange} aria-label="simple tabs example">
             <Tab label="Daily" {...a11yProps(0)} />
             <Tab label="Time Series" {...a11yProps(1)} />
          </Tabs>
          </Grid>
        </Grid>
      </div>
      </div>
      <TabPanel value={value} index={0}>
        <Daily sec={sec} type={type} date={props.date} air={props.air}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TimeSeries sec={sec} type={type} date={props.date} air={props.air}/>
      </TabPanel>
    </React.Fragment>
  );
}