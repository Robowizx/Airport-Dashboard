import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {request} from 'graphql-request';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    minHeight: 225
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  
}));

function ChartAPI(air,chart,query,element){
    fetch(`https://localhost:4000/${air}/${chart}/${query}`,{method:'GET'})
         .then((res)=> res.text())
         .then((out)=>{
            const iframe = document.getElementById(element).contentDocument;
            iframe.write(out);
            iframe.close();
         })
         .catch((err)=>{
          console.log(err);
        })
}  

export default function Daily(props) {
  const { sec, type, date, air} = props;
  const [selectedDate, changeDate] = React.useState(new Date(date));
  const prevType = usePrevious(type);
  const prevSec = usePrevious(sec);
  const prevDate = usePrevious(selectedDate);
  const [state, setState] = React.useState({
    total_devices:{
      num:"",
      active:""
    },
    active_surveys:{
      num:"",
      completed:""
    }
  });
  
  function usePrevious(value) {
    const ref = React.useRef();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  
  const query = `
  query($air:String!,$name:String!,$date:String!){
    device_name (air:$air,name:$name,date:$date){
      device_name
      exp
      rank
      avg_exp_index
      avg_imp_index
      active_surveys {
        num
        completed
      }
      total_devices {
        num
        active
      }
      total_resp_till_date
      
    }
  }
  `

  React.useEffect(() => {
    var pick = moment(selectedDate).format('yyyy-MM-DD')
    const variables = {
      "air": air,
      "name": type,
      "date": pick
    }
    if( prevType !== type || prevDate !== selectedDate || prevSec !== sec){
      ChartAPI(`${air}`,'exp',`${sec}?date=${pick}&type=${type}`,'exp1')
      ChartAPI(`${air}`,'res_donut',`?date=${pick}&type=${type}`,'donut')
      ChartAPI(`${air}`,'top_and_least',`?date=${pick}&type=${type}`,'top')
      ChartAPI(`${air}`,'res',`${sec}?date=${pick}&type=${type}`,'res')
      request(`https://localhost:4000/graphql`, query, variables)
      .then(data => {
        setState(data.device_name);
      })
      .catch((err)=>{
        console.log(err);
      })
    }
  }, [selectedDate, type, sec])
  const classes = useStyles();
  console.log("state"+state);

  const handleDateChange = (date)=>{
    if(date != selectedDate){
      changeDate(date)
    }
  }

  return (
    <React.Fragment>
      <div style={{marginTop:'9.0%'}}>
    <Grid container direction="column">
      <Grid item xs={12}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker 
         
              value={selectedDate} 
              onChange={handleDateChange} 
              variant='inline' 
              style={{float:"right"}}
              label="Date"/>
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Rank
              </Typography>
              <Typography variant="h4" component="h4">
                #{state.rank}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Experience Index
              </Typography>
              <Typography variant="h2" component="h2">
                {state.exp}%
              </Typography>
            </CardContent>
          </Card>
          </Grid>
          <Grid item>
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Experience Index Till Date
              </Typography>
              <Typography variant="h2" component="h2">
                {state.avg_exp_index}%
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Improvement Index Till Date
              </Typography>
              <Typography variant="h4" component="h4">
                {state.avg_imp_index}%
              </Typography>
            </CardContent>
          </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
          <Card className={classes.root}>
            <CardContent>
            <Typography className={classes.pos} color="textSecondary">
                Active Devices
              </Typography>
              <Typography variant="h4" component="h4">
                {state.total_devices.active + "/" + state.total_devices.num}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Completed Surveys
              </Typography>
              <Typography variant="h4" component="h4">
                {state.active_surveys.completed}/{state.active_surveys.num}
              </Typography>
            </CardContent>
          </Card>
          </Grid>
          <Grid item>
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Total Responses Till Date
              </Typography>
              <Typography variant="h2" component="h2">
                {state.total_resp_till_date}
              </Typography>
            </CardContent>
          </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Paper style={{height:"465px"}}><iframe height='100%' width='100%' frameBorder='0' id='donut' scrolling='off' style={{marginTop:"30px"}}></iframe></Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper style={{height:"465px"}}><iframe height='100%' width='100%' frameBorder='0' id='top' scrolling='off'></iframe></Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper style={{height:"450px"}}><iframe height='100%' width='100%' frameBorder='0' id='exp1' scrolling='off'></iframe></Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper style={{height:"450px", paddingTop:"25px", paddingLeft:"65px"}}><iframe height='100%' width='100%' frameBorder='0' id='res'  scrolling='off'></iframe></Paper>
      </Grid>
    </Grid>
    </div>
    </React.Fragment>
  );
}