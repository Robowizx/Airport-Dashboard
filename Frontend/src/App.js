import React, { Component } from 'react'
import "./App.css";
//import Device_page from "./Components/device_page";
import CustomAppBar from "./Components/CustomAppBar";
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles,ThemeProvider,createMuiTheme } from '@material-ui/core/styles';
import AirportPage from './Components/AirportPage';
import Device from './Components/Device';
import IndiaMap from './Components/mapPage/IndiaMap';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

const useStyles = makeStyles((theme)=>({
  root:{
    display:'flex'
  },
  content: {
    flexGrow: 1,
    width:"100%",
    height:"100%",
    padding: theme.spacing(3),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }
}));

export default function App() {

  const classes = useStyles();
  const [state,setState] = React.useState({
    menu:{
      airport:[],
      states:[],
      device:[]
    },
    headers:{
      state:null,
      airport:null
    },
    airport:null,
    device: null,
    date: null,
    home_state:null
  });

  const changePage = (options)=>{
      let prevState = {...state};
      if(options.menu){
            prevState.menu.airport = options.menu.airport ? options.menu.airport : prevState.menu.airport;
            prevState.menu.states = options.menu.states ? options.menu.states : prevState.menu.states;
            prevState.menu.device = options.menu.device ? options.menu.device : prevState.menu.device;
      }
      if(options.headers){
        prevState.headers.airport = options.headers.airport ? options.headers.airport : prevState.headers.airport;
        prevState.headers.state = options.headers.state ? options.headers.state : prevState.headers.state;
      }
      prevState.airport = options.airport ? options.airport : prevState.airport;
      prevState.device = options.device ? options.device : prevState.device;
      prevState.date = options.date ? options.date : prevState.date;
      setState(prevState);
  }

  console.log(state);

  const theme = createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#2196F3",
      },
      secondary: {
        main: "#2196F3",
      },
    },
  });

  return (
    
    <React.Fragment>
    <ThemeProvider theme={theme}> 
      <Router>
      <CssBaseline />
      <div className={classes.root}>
        <CustomAppBar menu={state.menu} headers={state.headers} change={changePage}/>
        <div className={classes.content}>
          <Switch>
            <Route path='/' exact render={()=> <IndiaMap change={changePage} curstate={state.home_state}/>}/>
            <Route path='/airport' exact render={()=> <AirportPage air={state.airport} change={changePage}/>}/>
            <Route path='/device' exact render={()=><Device air={state.airport} date={state.date} type={state.device}/>}/>
          </Switch>
        </div>
      </div> 
      </Router>
      </ThemeProvider>
    </React.Fragment>
  );
}
