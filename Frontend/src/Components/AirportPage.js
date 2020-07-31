import React from 'react';
import {Paper,
        Typography,
        Divider,
        Card,
        CardActionArea,
        CardContent
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { MuiPickersUtilsProvider,DatePicker } from '@material-ui/pickers';
import moment from 'moment-timezone';
import MomentUtils from '@date-io/moment';
import {orderBy} from 'lodash';
import { Link } from 'react-router-dom';

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
        backgroundColor:'#424242',
        top:'6.5%',
        right:'0',
        zIndex:2
    },
    impGood:{
        color:'#00ff00'
    },
    impBad:{
        color:'red'
    },
   
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
                if(iframe){
                    iframe.write(out);
                    iframe.close();
                }
             })
             .catch((err)=> console.log(err));
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
                setDevice(orderBy(data.data.airport_name.devices,['rank'],['asc']));
            })
            .catch((err)=>{
                console.log(err);
            })
        };

        ChartAPI(props.air,'guage',`/maxExp?date=${date.format('yyyy-MM-DD')}`,'guage1');
        ChartAPI(props.air,'guage',`/minExp?date=${date.format('yyyy-MM-DD')}`,'guage2');
        ChartAPI(props.air,'devExp',`?date=${date.format('yyyy-MM-DD')}`,'dev_exp');
        ChartAPI(props.air,'total_resp',`?sdate=${moment(date).subtract('7','days').format('yyyy-MM-DD')}&edate=${date.format('yyyy-MM-DD')}`,'heatmap');
        getData();
    },[date,props]);

    React.useEffect(()=>{
        for(let i=0;i<Device.length;i++){
            ChartAPI(props.air,'spark_line',`/${Device[i].device_name}?sdate=${moment(date).subtract('7','days').format('yyyy-MM-DD')}&edate=${date.format('yyyy-MM-DD')}`,'frame0'+i);
            ChartAPI(props.air,'spark_donut',`/${Device[i].device_name}?date=${date.format('yyyy-MM-DD')}`,'frame1'+i);
        }
    },[Device,props]);
    
    return (
       <React.Fragment>
           <div className={classes.sticky}> 
    <Typography variant="h2" style={{textAlign:'center',paddingTop:'2%',paddingLeft:'5%'}}>{props.air+" Airport"}</Typography>
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
           </div>         
           <div className={classes.root2}>
                <div className={classes.root}>
                        <Paper elevation={3} className={classes.paper_sm}>
                            <iframe height='90%' title='guage max' width='100%' frameBorder='0' scrolling='no' id='guage1'></iframe>
                        </Paper>
                        <Paper  elevation={3} className={classes.paper_sm}>
                            <iframe height='90%' width='100%' title='guage min' scrolling='no' frameBorder='0' id='guage2'></iframe>
                        </Paper>
                        <Paper  elevation={3} className={classes.paper_sm}>
                            <p style={{margin:'4%',paddingLeft:'3%',width:'100%',height:'20%',fontSize:'11pt',fontWeight:'bold'}}>Exp Index</p>
                            <p id='exp_value'style={{textAlign:'right',verticalAlign:'bottom',fontSize:'6.5em',margin:'20% 5% 5%'}}></p>
                        </Paper>
                        <Paper elevation={3} className={classes.paper_lg}>
                            <iframe height='100%' width='100%' scrolling='no' title='response heatmap' frameBorder='0' id='heatmap'></iframe>
                        </Paper>
                </div>
                <div className={classes.root3}>
                    <Paper elevation={3}>
                        <iframe height='100%' width='96%' style={{margin:'2%',marginTop:'0'}} frameBorder='0' title='device exp' scrolling='no' id='dev_exp'></iframe>
                    </Paper>
                </div>
           </div>
           <Divider/>
           <Typography variant="h3" style={{textAlign:'center',paddingTop:'2%'}}>Facilities</Typography>
           <div style={{display:'flex',flexFlow:'row wrap',justifyContent:'center',alignContent:'flex-start'}}>
               {
                   Device.map((element,index)=>(
                        <Card className={classes.device} zIndex='modal' key={element.device_name} elevation={3}>
                            <Link to='/device' style={{textDecoration:'none',color:'#fff'}} onClick={()=>{
                                let options={
                                    device: element.device_name,
                                    date: date
                                };
                                props.change(options);
                            }}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography variant="h3" style={{textAlign:'center'}}>{element.device_name}</Typography>
                                            <div style={{display:'flex',flexFlow:'row wrap',alignItems:'flex-start',justifyContent:'center'}}>
                                                <iframe id={"frame0"+index} style={{width:'9vw',height:'5vw',paddingTop:'1.5vw'}}  frameBorder='0' scrolling='no'></iframe>
                                                <iframe style={{width:'8vw',height:'4.5vw',paddingLeft:'1vw'}} id={"frame1"+index} frameBorder='0' scrolling='no'></iframe>
                                                <p style={{width:'9vw',height:'1vw',fontSize:'10pt',textAlign:'center',margin:0}}>Experience</p>
                                                <p style={{width:'9vw',height:'1vw',fontSize:'10pt',textAlign:'center',margin:0,paddingLeft:'1vw'}}>Responses</p>
                                                <div style={{display:'flex',flexFlow:'column wrap',justifyContent:'center',paddingRight:'2vw',paddingLeft:'0.5vw',paddingTop:'1vw'}}>
                                                    <p style={{fontSize:'18pt',margin:0}}>Exp Index</p>
                                                    <p style={{fontSize:'16pt',margin:0,textAlign:'center',color:(element.avg_exp_index < 34.0 ?"red":(element.avg_exp_index < 67.0?"#ff9933":"#00ff00"))}}>{element.avg_exp_index}</p>
                                                </div>
                                                 <div style={{display:'flex',flexFlow:'column wrap',justifyContent:'center',paddingLeft:'2vw',paddingRight:'0.5vw',paddingTop:'1vw'}}>
                                                    <p style={{fontSize:'18pt',margin:0}}>Imp Index</p>
                                                    <p style={{fontSize:'16pt',margin:0,textAlign:'center',color:(element.avg_imp_index < 0.0?"red":"#00ff00")}}>{element.avg_imp_index}</p>
                                                </div>
                                                <div style={{display:'flex',flexFlow:'column wrap',justifyContent:'center',paddingBottom:'1vw',paddingTop:'1vw'}}>
                                                    <p style={{fontSize:'18pt',margin:0}}>Rank</p>
                                                    <p style={{fontSize:'16pt',margin:0,textAlign:'center'}}>#{element.rank}</p>
                                                </div>
                                            </div>
                                    </CardContent>
                                </CardActionArea>
                            </Link>
                        </Card>    
                   ))
               }
           </div>   
       </React.Fragment>
    );
}
