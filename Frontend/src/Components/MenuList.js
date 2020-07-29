import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {List,
        ListItem,
        ListItemIcon,
        ListItemText,
        Collapse,
        ClickAwayListener
 } from '@material-ui/core';
import LocalAirportIcon from '@material-ui/icons/LocalAirport';
import RoomServiceIcon from '@material-ui/icons/RoomService';
import ExploreIcon from '@material-ui/icons/Explore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/Home';
import {Link} from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));


export default function MenuList(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState({airport:false,states:false,device:false});

  const handleClickAway = ()=>{
      setOpen({airport:false,states:false,device:false});
  }

  const listout = (marker,event)=> {
    return(
       <React.Fragment>
            <ListItem button key={marker} onClick={()=>{
                let obj ={airport:open.airport,states:open.states,device:open.device};
                if(!open[event])
                    props.navOpen();
                obj[event] = !obj[event];
                setOpen(obj);
            }}
            >
            <ListItemIcon key={marker+'-icon'}>
                {
                    event === 'states' ? <ExploreIcon /> : (
                        event === 'airport' ? <LocalAirportIcon /> : <RoomServiceIcon/>
                    )
                }
            </ListItemIcon>
            <ListItemText key={marker+'-text'} primary={marker}/>
            {open[event] ? <ExpandLess /> :<ExpandMoreIcon />}
        </ListItem>
        <Collapse in={open[event]} key={marker+"-sublist"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            {
               props.menu[event].map((text)=>(
                <ListItem button key={text} className={classes.nested} onClick={marker==='States'?
                ()=>{
                  let option={
                    menu:{
                      airport:[],
                      device:[],
                      states:[]
                    },
                    headers:{
                      state:null,
                      airport: null,
                    },
                    airport:null,
                    device:null,
                    date:null,
                    home_state:text
                  }
                  props.change(option);
                  document.getElementById('home_link').click();
                }:()=>{
                  let option={
                    airport:text,
                    device:null,
                    date:null,
                    home_state:null
                  }
                  props.change(option);
                }}>
                    <ListItemText key={text+'-text'}secondary={text} /> 
                </ListItem>       
               ))
            }
            </List>    
        </Collapse>
       </React.Fragment>
    )
  }

  return (
    <React.Fragment>
     <Link to='/' id='home_link'/> 
    <ClickAwayListener onClickAway={handleClickAway}>
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
        >{[ (<ListItem button key='home'
               onClick={()=>{
                    let option={
                      menu:{
                        airport:[],
                        device:[],
                        states:[]
                      },
                      headers:{
                        state:null,
                        airport: null,
                      },
                      airport:null,
                      device:null,
                      date:null,
                      home_state:null
                    }
                    if(open)
                      setOpen(!open);
                    props.change(option);
                    document.getElementById('home_link').click();
                  }}>
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText key='home_text' primary="Home"/>
            </ListItem>),
            props.menu.states.length > 0 ? listout("States",'states'):null,
            props.menu.airport.length > 0 ? listout(props.headers.state+" - Airports ",'airport'):null,
            props.menu.device.length > 0 ? listout(props.headers.airport+" - Facilities",'device'):null            
        ]}
        </List>
    </ClickAwayListener>
    </React.Fragment>
  );
}
