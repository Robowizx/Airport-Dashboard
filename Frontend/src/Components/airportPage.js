import React, { Component } from 'react';
import "../App.css";

export default class airportPage extends Component {
  constructor(props){
    super(props);
    console.log("safsfdqsa",props);
    this.state = {
      airport: this.props.airState,
      date: this.props.date,
      device: this.props.dev
    };
  }
  render() {
    return (
      <div className="map">
        <h1>{ this.state.airport } + { this.state.date } + {this.state.device}</h1>
      </div>
    )
  }
}
