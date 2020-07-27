import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from 'moment';


const useStyles = makeStyles((theme) => ({
  root: {
    display:'flex',
    flexWrap: 'wrap',
  },
  root1:{
      display:'flex',
      flexWrap: 'wrap',
      width:'50%',
      '& > *': {
        margin: theme.spacing(1),
        width: '40vw',
        height:'24vw',
      },
  },
  root2: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent:'center',
    width:'50%',
    '& > *': {
      margin: theme.spacing(1),
      width: '20vw',
      height:'24vw',
    },
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


export default function Daily() {
  const classes = useStyles();
  const [open, setState] = React.useState();
  const [sec, setSec] = React.useState("by_device");
  const [type, setType] = React.useState("EI");
  const [change, setChange] = React.useState(true);
  const [selectedDate, changeDate] = React.useState(new Date());

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
      setSec(event.target.value)
      ChartAPI('exp',`${event.target.value}?date=${moment(selectedDate).format('yyyy-MM-DD')}&type=EI`,'exp1');
      ChartAPI('res',`${event.target.value}?date=${moment(selectedDate).format('yyyy-MM-DD')}&type=EI`,'res');
    }
  }
  const handleDevChange = (event) =>{
    if(event.target.value != type){
      setType(event.target.value)
      ChartAPI('exp',`${sec}?date=${moment(selectedDate).format('yyyy-MM-DD')}&type=${event.target.value}`,'exp1');
      ChartAPI('res',`${sec}?date=${moment(selectedDate).format('yyyy-MM-DD')}&type=${event.target.value}`,'res');
      ChartAPI('res_donut',`?date=${moment(selectedDate).format('yyyy-MM-DD')}&type=${event.target.value}`,'donut')
      ChartAPI('top_and_least',`?date=${moment(selectedDate).format('yyyy-MM-DD')}&type=${event.target.value}`,'top')
    }
  }
  const handleDateChange = (date)=>{
    if(date != selectedDate){
      changeDate(date)
      var pick = moment(date).format('yyyy-MM-DD')
      ChartAPI('exp',`${sec}?date=${pick}&type=EI`,'exp1')
      ChartAPI('res_donut',`?date=${pick}&type=EI`,'donut')
      ChartAPI('top_and_least',`?date=${pick}&type=EI`,'top')
      ChartAPI('res',`${sec}?date=${pick}&type=EI`,'res')
    }
    else setChange(false);
  }
  if(change){
    var pick = moment(selectedDate).format('yyyy-MM-DD')
    ChartAPI('exp',`${sec}?date=${pick}&type=EI`,'exp1')
    ChartAPI('res_donut',`?date=${pick}&type=EI`,'donut')
    ChartAPI('top_and_least',`?date=${pick}&type=EI`,'top')
    ChartAPI('res',`${sec}?date=${pick}&type=EI`,'res')
  }
  return (
    <React.Fragment>
      <FormControl >
        <Grid container direction="row" spacing={1}>
          <Grid item>
          <InputLabel id="demo-controlled-open-select-label">Section</InputLabel>
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
          <InputLabel id="demo"></InputLabel>
            <Select
            labelId="demo"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={type}
            onChange={handleDevChange }
            >

              <MenuItem value={"EI"}>EI</MenuItem>
              <MenuItem value={"SC"}>SC</MenuItem>
              <MenuItem value={"RT"}>RT</MenuItem>
              <MenuItem value={"RF"}>RF</MenuItem>
              <MenuItem value={"DF"}>DF</MenuItem>
              <MenuItem value={"TP"}>TP</MenuItem>
              <MenuItem value={"TR"}>TR</MenuItem>
              <MenuItem value={"EV"}>EV</MenuItem>
              <MenuItem value={"FG"}>FG</MenuItem>
              <MenuItem value={"CM"}>CM</MenuItem>
          </Select>
          </Grid>
          </Grid>
    </FormControl>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker value={selectedDate} onChange={handleDateChange} variant='inline' style={{float:"right"}}/>
    </MuiPickersUtilsProvider>
    <div className={classes.root}>
      <div className={classes.root2}>
        <Paper></Paper>
        <Paper>
        
        </Paper>
        <Paper>
        <iframe height='100%' width='100%' frameBorder='0' id='top' scrolling='off'></iframe>
        </Paper>
        <Paper>
        <iframe height='100%' width='100%' frameBorder='0' id='donut' scrolling='off' style={{marginTop:"50px"}}></iframe>
        </Paper>
      </div>
      <div className={classes.root1}>
          <Paper>
          <iframe height='100%' width='100%' frameBorder='0' id='exp1' scrolling='off'></iframe>
          </Paper>
          <Paper>
          <iframe height='100%' width='100%' frameBorder='0' id='res'  scrolling='off'></iframe>
          </Paper>
      </div>
    </div>
    </React.Fragment>
  );
}