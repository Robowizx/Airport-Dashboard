import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    display:'flex',
    flexWrap: 'wrap',
    direction:'row'
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
  const { sec, type} = props;
  const prev_date = new Date();
  prev_date.setDate(prev_date.getDate() - 7);
  
  const [state, changeDate] = React.useState({
      startDate : prev_date,
      endDate : new Date()
  });
  const prevType = usePrevious(type);
  const prevSec = usePrevious(sec);
  const prevDate = usePrevious(state);
  function usePrevious(value) {
    const ref = React.useRef();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const handleStartDateChange = (sdate)=>{
    if(sdate != state.startDate){
      changeDate({
        ...state,
        startDate:sdate
      })
    }
  }
  const handleEndDateChange = (edate)=>{
    if(edate != state.endDate){
      changeDate({
        ...state,
        endDate:edate
      })
    }
  }

  React.useEffect(() => {
    let sdate = moment(state.startDate).format('yyyy-MM-DD')
    let edate = moment(state.endDate).format('yyyy-MM-DD')
 
    if( prevType !== type || prevDate !== state){
      ChartAPI('exp_series',`${sec}?sdate=${sdate}&edate=${edate}&type=${type}`,'exp1')
      ChartAPI('allRes_TS',`?sdate=${sdate}&edate=${edate}&type=${type}`,'allRes')
      ChartAPI('exp_till_date',`?sdate=${sdate}&edate=${edate}&type=${type}`,'exp_till')
      ChartAPI('top_least_timeseries',`${sec}?sdate=${sdate}&edate=${edate}&type=${type}`,'top')
      ChartAPI('restime',`${sec}?sdate=${sdate}&edate=${edate}&type=${type}`,'restime')
    }
    if( prevSec !== sec ){
      ChartAPI('restime',`${sec}?sdate=${sdate}&edate=${edate}&type=${type}`,'restime')
      ChartAPI('top_least_timeseries',`${sec}?sdate=${sdate}&edate=${edate}&type=${type}`,'top')
      ChartAPI('exp_series',`${sec}?sdate=${sdate}&edate=${edate}&type=${type}`,'exp1')
    }
  }, [state, type, sec])
  
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid container direction="column">
        <Grid item xs={12}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker value={state.endDate} onChange={handleEndDateChange} variant='inline' style={{float:"right"}}/>
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker value={state.startDate} onChange={handleStartDateChange} variant='inline' style={{float:"right"}}/>
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      <Grid container alignContent="center" spacing={4}>
        <Grid item xs={4}>
          <Paper style ={{height:"360px"}}><iframe height='350.022px' width='100%' frameBorder='0' id='top' scrolling='off'></iframe></Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style ={{height:"360px"}}><iframe height='100%' width='100%' frameBorder='0' id='exp_till' scrolling='off'></iframe></Paper>
        </Grid>
        <Grid item xs = {4}>
          <Paper style ={{height:"360px"}}><iframe height='350.022px' width='100%' frameBorder='0' id='allRes' scrolling='off'></iframe></Paper>
        </Grid>
        <Grid container xs={12} spacing={4}>
        <Grid item xs={6}>
          <Paper style ={{height:"1400px"}}><iframe height='100%' width='100%' frameBorder='0' id='exp1' scrolling='off'></iframe></Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style ={{height:"1400px"}}><iframe height='100%' width='100%' frameBorder='0' id='restime' scrolling='off'></iframe></Paper>
        </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}