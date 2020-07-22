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

  componentDidMount(){

  }

  getContent(url1,idChart) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById(idChart);
    fetch(url1, { method: "GET", headers: header })
      .then((response) => response.text())
      .then((data) => { iframe.contentDocument.write(data); })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="map">
        <iframe  width="50%" height="500" title="exp" id="ifm1" frameborder="0"></iframe>
      </div>
    )
  }
}
