import React from "react";
import "./App.css";
//import Device_page from "./Components/device_page";
import CustomAppBar from "./Components/CustomAppBar";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Device from './Components/Device';

const useStyles = makeStyles((theme)=>({
  root:{
    display:'flex'
  },
  content: {
    flexGrow: 1,
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
    airport:['Bangalore','Mysore'],
    states:[],
    device:['EI','CM']
  };
  const headers = {
    state:'Karnataka',
    airport:'Mysore'
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.root}>
        <CustomAppBar menu={menu} headers={headers} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Device />
        </main>
      </div> 
    </React.Fragment>
  );
}
