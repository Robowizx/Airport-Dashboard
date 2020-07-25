import React from 'react';
import {Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexFlow: 'row wrap',
      width:'50%'
    },
    paper_sm:{
        margin: theme.spacing(1),
        width: '14vw',
        height:'14vw',
    },
    paper_lg:{
        margin: theme.spacing(1),
        width: '44vw',
        height:'14vw',
        paddingBottom:'25vw'
    },
    root2:{
        display:'flex',
        flexWrap: 'wrap'
    },
    root3:{
        display:'flex',
        flexFlow: 'row wrap',
        justifyContent:'center',
        width:'50%',
        '& > *': {
            margin: theme.spacing(1),
            width: '45vw',
            height:'40vw',
          },
    }
  }));

function ChartAPI(air,chart,query,element){
    fetch(`https://localhost:4000/${air}/${chart}${query}`,{method:'GET'})
         .then((res)=> res.text())
         .then((out)=>{
            const iframe = document.getElementById(element).contentDocument;
            console.log(chart,out);
            iframe.write(out);
            iframe.close();
         });
}  

export default function AirportPage(props) {
    const classes = useStyles();
    ChartAPI('Kolkata','guage','/maxExp?date=2020-03-07','guage1');
    ChartAPI('Kolkata','guage','/minExp?date=2020-03-07','guage2');
    ChartAPI('Kolkata','devExp','?date=2020-03-07','dev_exp');
    ChartAPI('Kolkata','total_resp','?sdate=2020-03-01&edate=2020-03-07','heatmap');
    
    return (
       <React.Fragment>
           <h1 style={{textAlign:'center',margin:'0px 0px 1vw 0px'}}>Kolkata Airport</h1>
           <div className={classes.root2}>
                <div className={classes.root}>
                        <Paper className={classes.paper_sm}>
                            <iframe style={{paddingTop:'1vw'}} height='100%' width='100%' frameBorder='0' scrolling='no' id='guage1'></iframe>
                        </Paper>
                        <Paper className={classes.paper_sm}>
                            <iframe style={{paddingTop:'1vw'}} height='100%' width='100%' scrolling='no' frameBorder='0' id='guage2'></iframe>
                        </Paper>
                        <Paper className={classes.paper_sm}>
                            <p>EXP INDEX</p>
                        </Paper>
                        <Paper className={classes.paper_lg}>
                            <iframe height='100%' width='100%' frameBorder='0' scrolling='no' id='heatmap'></iframe>
                        </Paper>
                </div>
                <div className={classes.root3}>
                    <Paper>
                        <iframe height='98%' width='98%'style={{paddingTop:'15%',paddingLeft:'5%'}} frameBorder='0' scrolling='no' id='dev_exp'></iframe>
                    </Paper>
                </div>
           </div>   
       </React.Fragment>
    );
}
