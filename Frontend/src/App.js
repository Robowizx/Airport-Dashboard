import React from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import "./App.css";
import PrimarySearchAppBar from "./Components/PrimarySearchAppBar.js";
import Daily from "./Components/daily.js"
import TimeSeries from "./Components/timeseries";
export default function App() {
  return (
    <div className="App">
      <Router>
      <PrimarySearchAppBar />
          <Switch>
            <Route path='/' exact component={Daily}/>
            <Route path='/TimeSeries' component={TimeSeries}/>
          </Switch>
        </Router>
    </div>
  );
}
