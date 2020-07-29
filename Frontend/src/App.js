import React, { Component } from 'react'
import "./App.css";
import { Route, BrowserRouter as Router} from "react-router-dom";

import IndiaMap from "./Components/mapPage/IndiaMap.jsx";
import AirportPage from "./Components/airportPage/airportPage";
import PrimarySearchAppBar from "./Components/menuBar/PrimarySearchAppBar";
import GaugeChart from "./Components/mapPage/gaugeChart"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
       airName: "",
       date: "",
       device: ""
    }
  }

  updateState = async(n,d,dev)=>{
    await this.setState({airName: n, date: d, device: dev});
  }
  
  render() {
    return (
    <Router>
      <div className="App">
      <PrimarySearchAppBar/>
      </div>
      <Route path="/Home" render={ (props)=> <IndiaMap {...props} updateState={this.updateState}/> } />
      <Route path="/airport" render={
        (props) => <AirportPage {...props} airState={this.state.airName}
        date={ this.state.date}
        dev={this.state.device}/>
      }/>
    </Router>
    )
  }
}

export default App;