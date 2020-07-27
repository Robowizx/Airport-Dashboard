import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';

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
export default function Daily() {
  const classes = useStyles();
  ChartAPI('exp_series','by_device?sdate=2020-03-05&edate=2020-03-15&type=EI','exp1')
  ChartAPI('allRes_TS','?sdate=2020-03-05&edate=2020-03-15&type=EI','allRes')
  ChartAPI('exp_till_date','?sdate=2020-03-05&edate=2020-03-15&type=EI','exp_till')
  ChartAPI('top_least_timeseries','by_device?sdate=2020-03-05&edate=2020-03-15&type=EI','top')
  ChartAPI('restime','by_device?sdate=2020-03-05&edate=2020-03-15&type=EI','restime')
  return (
    <React.Fragment>
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
          <Paper style ={{height:"700px"}}><iframe height='100%' width='100%' frameBorder='0' id='exp1' scrolling='off'></iframe></Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style ={{height:"700px"}}><iframe height='100%' width='100%' frameBorder='0' id='restime' scrolling='off'></iframe></Paper>
        </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
{/* <iframe height='100%' width='100%' frameBorder='0' id='top' scrolling='off'></iframe> 
<iframe height='100%' width='100%' frameBorder='0' id='exp_till' scrolling='off'></iframe>
<iframe height='100%' width='100%' frameBorder='0' id='allRes' scrolling='on'></iframe>
<iframe height='100%' width='100%' frameBorder='0' id='exp1' scrolling='off'></iframe>
<iframe height='100%' width='100%' frameBorder='0' id='restime' scrolling='off'></iframe>
*/}