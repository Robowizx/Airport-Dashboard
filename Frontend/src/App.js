import React from "react";
import "./App.css";
import Device_page from "./Components/device_page";
import CustomAppBar from "./Components/CustomAppBar";
import CssBaseline from '@material-ui/core/CssBaseline';

export default function App() {

  const menu = {
    airport:["Bangalore","Mysore"],
    states:["Karnataka","Maharashtra"],
    device:["EI"]
  };
  const headers = {
    state:'Karnataka',
    airport:'Mysore'
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <CustomAppBar menu={menu} headers={headers} />
    </React.Fragment>
  );
}
