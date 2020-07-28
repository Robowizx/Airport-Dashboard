import React from "react";
import "./App.css";
//import Device_page from "./Components/device_page";
import CustomAppBar from "./Components/CustomAppBar";
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import AirportPage from './Components/AirportPage';
import Device from './Components/Device';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

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
  const menu = {
    airport:['Kolkata',''],
    states:[],
    device:['EI','CM']
  };
  const headers = {
    state:'West Bengal',
    airport:'Kolkata'
  }



  return (
    <React.Fragment>
      <Router>
      <CssBaseline />
      <div className={classes.root}>
        <CustomAppBar menu={menu} headers={headers} />
        <div className={classes.content}>
          {/* <div className={classes.toolbar} /> */}
          <Switch>
            <Route path="/" exact component={AirportPage} />
            <Route path="/device" exact component={Device} />
          </Switch>
        </div>
      </div> 
      </Router>
    </React.Fragment>
  );
}
