
import React, { Component } from "react";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.test_server();
  }
  
  test_server(){
    var test = document.getElementById("testChart");
    const url = "https://localhost:4000/Bhopal/res/by_device?date=2020-03-04&type=EI";
    fetch(url, {
      method: "GET",
      headers: {
        Authorization:"Basic OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA=="
      },
    })
      .then((response) => response.text())
      .then((data) => { test.contentDocument.write(data); }).catch((err)=>{return err});
  }



  render(){
    return(
    <div>
      <iframe title="chart" id="testChart" width="600" height="600"></iframe>
    </div>);
  }
}
