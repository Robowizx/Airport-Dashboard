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
    minHeight: 450
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
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

function ChartAPI(chart,query,element){
    fetch(`https://localhost:4000/Kolkata/${chart}/${query}`,{method:'GET'})
         .then((res)=> res.text())
         .then((out)=>{
            const iframe = document.getElementById(element).contentDocument;
            iframe.write(out);
            iframe.close();
         });
}  

export default function Daily(props) {
  const { sec, type, change} = props;
  const [selectedDate, changeDate] = React.useState(new Date());
  const prevType = usePrevious(type);
  const prevSec = usePrevious(sec);
  const prevDate = usePrevious(selectedDate);
  const [state, setState] = React.useState([])
  
  function usePrevious(value) {
    const ref = React.useRef();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  
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

  React.useEffect(() => {
    var pick = moment(selectedDate).format('yyyy-MM-DD')
    const variables = {
      "name": "Kolkata",
      "date": pick
    }
    if( prevType !== type || prevDate !== selectedDate){
      ChartAPI('exp',`${sec}?date=${pick}&type=${type}`,'exp1')
      ChartAPI('res_donut',`?date=${pick}&type=${type}`,'donut')
      ChartAPI('top_and_least',`?date=${pick}&type=${type}`,'top')
      ChartAPI('res',`${sec}?date=${pick}&type=${type}`,'res')
      request(`https://localhost:4000/graphql`, query, variables)
      .then(data => {
        setState(data.airport_name.devices.find((ele)=>{
          if(ele.device_name == type){
            return ele
          }
        }));
    });
    }
    if( prevSec !== sec ){
      ChartAPI('exp',`${sec}?date=${pick}&type=${type}`,'exp1')
      ChartAPI('res',`${sec}?date=${pick}&type=${type}`,'res')
    }
  }, [selectedDate, type, sec])
  const classes = useStyles();


  const handleDateChange = (date)=>{
    if(date != selectedDate){
      changeDate(date)
    }
  }

  return (
    <React.Fragment>
    <Grid container direction="column">
      <Grid item xs={12}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker value={selectedDate} onChange={handleDateChange} variant='inline' style={{float:"right"}}/>
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item xs={3}>
  <Paper style={{height:"450px"}}>
  <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Type of Facility
        </Typography>
        <Typography variant="h2" component="h2">
          {state.device_name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          adjective
        </Typography>
        <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
    </Card>
  </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper style={{height:"450px"}}></Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper style={{height:"450px"}}><iframe height='100%' width='100%' frameBorder='0' id='donut' scrolling='off' style={{marginTop:"50px"}}></iframe></Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper style={{height:"450px"}}><iframe height='100%' width='100%' frameBorder='0' id='top' scrolling='off'></iframe></Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper style={{height:"450px"}}><iframe height='100%' width='100%' frameBorder='0' id='exp1' scrolling='off'></iframe></Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper style={{height:"450px"}}><iframe height='100%' width='100%' frameBorder='0' id='res'  scrolling='off'></iframe></Paper>
      </Grid>
    </Grid>
    </React.Fragment>
  );
}