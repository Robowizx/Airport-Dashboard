import React from 'react';
import {Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent:'center',
      width:'50%',
      '& > *': {
        margin: theme.spacing(1),
        width: '20vw',
        height:'20vw',
      },
    },
    root2:{
        display:'flex',
        flexWrap: 'wrap'
    },
    root3:{
        display:'flex',
        flexFlow: 'row wrap',
        width:'50%',
        '& > *': {
            margin: theme.spacing(1),
            width: '40vw',
            height:'20vw',
          },
    }
  }));

function ChartAPI(air,chart,query,element){
    fetch(`https://localhost:4000/${air}/${chart}${query}`,{method:'GET'})
         .then((res)=> res.text())
         .then((out)=>{
            const iframe = document.getElementById(element).contentDocument;
            iframe.write(out);
            iframe.close();
         });
}  

export default function AirportPage(props) {
    const classes = useStyles();
    ChartAPI('Kolkata','guage','/maxExp?date=2020-03-04','guage1');
    ChartAPI('Kolkata','guage','/minExp?date=2020-03-04','guage2');
    
    return (
       <React.Fragment>
           <h1 style={{textAlign:'center',margin:'0px 0px 1vw 0px'}}>Kolkata Airport</h1>
           <div className={classes.root2}>
                <div className={classes.root}>
                        <Paper>
                            <iframe style={{paddingTop:'1vw'}} height='100%' width='100%' frameBorder='0' scrolling='no' id='guage1'></iframe>
                        </Paper>
                        <Paper>
                            <iframe style={{paddingTop:'1vw'}} height='100%' width='100%' scrolling='no' frameBorder='0' id='guage2'></iframe>
                        </Paper>
                        <Paper>
                            <iframe height='100%' width='100%' frameBorder='0' id='exp'></iframe>
                        </Paper>
                </div>
                <div className={classes.root3}>
                    <Paper/>
                    <Paper/>
                </div>
           </div>
               
       </React.Fragment>
    );
}
