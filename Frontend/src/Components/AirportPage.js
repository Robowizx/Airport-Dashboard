import React from 'react';
import {Paper,
        Typography,
        Divider
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { MuiPickersUtilsProvider,DatePicker } from '@material-ui/pickers';
import moment from 'moment-timezone';
import MomentUtils from '@date-io/moment';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent:'center',
      width:'50%'
    },
    paper_sm:{
        margin: theme.spacing(1),
        width: '30%',
        height:'35%',
    },
    paper_lg:{
        margin: theme.spacing(1),
        width: '94%',
        height:'58%',

    },
    root2:{
        paddingTop:'0.5%',
        display:'flex',
        flexWrap: 'wrap',
        height:'40vw'
    },
    root3:{
        display:'flex',
        flexFlow: 'row wrap',
        justifyContent:'center',
        width:'50%',
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
            height:'96.8%',
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
    const [exp,setExp] = React.useState('');
    const [date,setDate] = React.useState(moment());
    const [change,setChange] = React.useState(true);
    
    if(change){
        ChartAPI('Kolkata','guage',`/maxExp?date=${date.format('yyyy-MM-DD')}`,'guage1');
        ChartAPI('Kolkata','guage',`/minExp?date=${date.format('yyyy-MM-DD')}`,'guage2');
        ChartAPI('Kolkata','devExp',`?date=${date.format('yyyy-MM-DD')}`,'dev_exp');
        ChartAPI('Kolkata','total_resp',`?sdate=${moment(date).subtract('7','days').format('yyyy-MM-DD')}&edate=${date.format('yyyy-MM-DD')}`,'heatmap');
    }
    
    return (
       <React.Fragment>
                <Typography variant="h2" style={{textAlign:'center'}}>Kolkata Airport</Typography>
                <div style={{display:'flex',justifyContent:'flex-end'}}>
                     <MuiPickersUtilsProvider  utils={MomentUtils}>
                         <DatePicker 
                             variant="inline" 
                             label="Date" 
                             style={{paddingRight:'4%'}} 
                             format="DD-MMM-yyyy" 
                             value={date} 
                             onChange={(d)=>{
                                 console.log(d);
                                 setDate(d);
                                 setChange(true);
                         }} />
                     </MuiPickersUtilsProvider>
                </div>
           <div className={classes.root2}>
                <div className={classes.root}>
                        <Paper elevation={3} className={classes.paper_sm}>
                            <iframe style={{paddingTop:'1vw'}} height='100%' width='100%' frameBorder='0' scrolling='no' id='guage1'></iframe>
                        </Paper>
                        <Paper  elevation={3} className={classes.paper_sm}>
                            <iframe style={{paddingTop:'1vw'}} height='100%' width='100%' scrolling='no' frameBorder='0' id='guage2'></iframe>
                        </Paper>
                        <Paper  elevation={3} className={classes.paper_sm}>
                            <h3 style={{paddingTop:'2%',paddingLeft:'10%',width:'100%',height:'20%'}}>Exp. Index</h3>
                            <p style={{textAlign:'right',verticalAlign:'bottom',fontSize:'6.5em',margin:'20% 5% 5%'}}>34%</p>
                        </Paper>
                        <Paper elevation={3} className={classes.paper_lg}>
                            <iframe height='100%' width='100%' scrolling='no' frameBorder='0' id='heatmap'></iframe>
                        </Paper>
                </div>
                <div className={classes.root3}>
                    <Paper elevation={3}>
                        <iframe height='100%' width='90%' style={{margin:'2% 5% 4%'}}frameBorder='0' scrolling='no' id='dev_exp'></iframe>
                    </Paper>
                </div>
           </div>   
       </React.Fragment>
    );
}
