import React from 'react';
import {Paper,
        Typography,
        Divider,
        Card,
        CardActionArea,
        CardContent,
        Box
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
        paddingTop:'11%',
        paddingBottom:'1%',
        paddingRight:'0.5%',
        display:'flex',
        flexWrap: 'wrap',
        height:'51vw'
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
    },
    device:{
        margin: theme.spacing(1),
        width:'20vw',
        height:'20vw'
    },
    sticky:{
        position:'fixed',
        height:'13.4%',
        width:'95.65%',
        backgroundColor:'rgb(251,251,251)',
        top:'6.5%',
        right:'0',
        zIndex:2
    }
  }));

export default function AirportPage(props){
    const classes = useStyles();
    const [Device,setDevice] = React.useState([]);
    const [date,setDate] = React.useState(moment());

    const ChartAPI = (air,chart,query,element)=>{
        fetch(`https://localhost:4000/${air}/${chart}${query}`,{method:'GET'})
             .then((res)=> res.text())
             .then((out)=>{
                const iframe = document.getElementById(element).contentDocument;
                iframe.write(out);
                iframe.close();
             });
    };

    React.useEffect(()=>{

        const getData = ()=>{

            const query = `query{
                airport_name(name:"Kolkata" date:"${date.format('yyyy-MM-DD')}"){
                    exp
                    num_of_devs
                    devices{
                      device_name
                      avg_exp_index
                      rank
                      avg_imp_index
                    }
                }
            }`;
            
            fetch('https://localhost:4000/graphql',{
                method:'POST',
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify({query})
            })
            .then((response)=> response.json())
            .then((data)=>{
                document.getElementById('exp_value').innerHTML = Math.floor(data.data.airport_name.exp)+'%';
                setDevice(data.data.airport_name.devices);
            })
            .catch((err)=>{
                console.log(err);
            })
        };

        ChartAPI('Kolkata','guage',`/maxExp?date=${date.format('yyyy-MM-DD')}`,'guage1');
        ChartAPI('Kolkata','guage',`/minExp?date=${date.format('yyyy-MM-DD')}`,'guage2');
        ChartAPI('Kolkata','devExp',`?date=${date.format('yyyy-MM-DD')}`,'dev_exp');
        ChartAPI('Kolkata','total_resp',`?sdate=${moment(date).subtract('7','days').format('yyyy-MM-DD')}&edate=${date.format('yyyy-MM-DD')}`,'heatmap');
        getData();
    },[date]);

    React.useEffect(()=>{

    },[Device]);
    
    return (
       <React.Fragment>
           <div className={classes.sticky}> 
                <Typography variant="h2" style={{textAlign:'center',paddingTop:'2%',paddingLeft:'5%'}}>Kolkata Airport</Typography>
                <div style={{position:'fixed',right:'5%',top:'13%'}}>
                     <MuiPickersUtilsProvider  utils={MomentUtils}>
                         <DatePicker 
                             variant="inline" 
                             label="Date" 
                             style={{paddingRight:'10%'}} 
                             format="DD-MMM-yyyy" 
                             value={date} 
                             onChange={(d)=>{
                                 setDate(d);
                         }} />
                     </MuiPickersUtilsProvider>
                </div> 
                <Divider style={{marginTop:'0.8%'}}/>
           </div>         
           <div className={classes.root2}>
                <div className={classes.root}>
                        <Paper elevation={3} className={classes.paper_sm}>
                            <iframe style={{paddingTop:'1vw'}} height='100%' title='guage max' width='100%' frameBorder='0' scrolling='no' id='guage1'></iframe>
                        </Paper>
                        <Paper  elevation={3} className={classes.paper_sm}>
                            <iframe style={{paddingTop:'1vw'}} height='100%' width='100%' title='guage min' scrolling='no' frameBorder='0' id='guage2'></iframe>
                        </Paper>
                        <Paper  elevation={3} className={classes.paper_sm}>
                            <h3 style={{paddingTop:'2%',paddingLeft:'10%',width:'100%',height:'20%'}}>Exp. Index</h3>
                            <p id='exp_value'style={{textAlign:'right',verticalAlign:'bottom',fontSize:'6.5em',margin:'20% 5% 5%'}}></p>
                        </Paper>
                        <Paper elevation={3} className={classes.paper_lg}>
                            <iframe height='100%' width='100%' scrolling='no' title='response heatmap' frameBorder='0' id='heatmap'></iframe>
                        </Paper>
                </div>
                <div className={classes.root3}>
                    <Paper elevation={3}>
                        <iframe height='100%' width='90%' style={{margin:'2% 5% 4%'}} frameBorder='0' title='device exp' scrolling='no' id='dev_exp'></iframe>
                    </Paper>
                </div>
           </div>
           <Divider/>
           <Typography variant="h3" style={{textAlign:'center',paddingTop:'2%'}}>Facilities</Typography>
           <div style={{display:'flex',flexFlow:'row wrap',justifyContent:'center',alignContent:'flex-start'}}>
               {
                   Device.map((element,index)=>(
                      <Card className={classes.device} zIndex='modal' key={element.device_name} elevation={3}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography variant="h3" style={{textAlign:'center'}}>{element.device_name}</Typography>
                                    <div style={{display:'grid',gridTemplateColumns:'50% 50%',gridTemplateRows:'30% 30% 30%',rowGap:'1%'}}>
                                        <p>{'Exp Index '+element.avg_exp_index}</p>
                                        <iframe height='30%' width='50%' id={"frame0"+index}  frameborder='0' scrolling='no'></iframe>
                                        <p>{'Imp Index '+element.avg_imp_index}</p>
                                        <p>{'Rank '+element.rank}</p>
                                        <p>Responses</p>
                                        <iframe id={"frame1"+index} frameborder='0' scrolling='no'></iframe>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                      </Card>    
                   ))
               }
           </div>   
       </React.Fragment>
    );
}
