import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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
  ChartAPI('exp','by_device?date=2020-03-01&type=EI','exp1')
  ChartAPI('res_donut','?date=2020-03-01&type=EI','donut')
  ChartAPI('top_and_least','?date=2020-03-01&type=EI','top')
  ChartAPI('res','by_device?date=2020-03-01&type=EI','res')
  return (
    <div className={classes.root}>
      <div className={classes.root2}>
        <Paper></Paper>
        <Paper>
        
        </Paper>
        <Paper>
        <iframe height='100%' width='100%' frameBorder='0' id='top' scrolling='off'></iframe>
        </Paper>
        <Paper>
        <iframe height='100%' width='100%' frameBorder='0' id='donut' scrolling='off'></iframe>
        </Paper>
      </div>
      <div className={classes.root1}>
          <Paper>
          <iframe height='100%' width='100%' frameBorder='0' id='exp1' scrolling='off'></iframe>
          </Paper>
          <Paper>
          <iframe height='100%' width='window.innerWidth' frameBorder='0' id='res' scrolling='off'></iframe>
          </Paper>
      </div>
    </div>
  );
}