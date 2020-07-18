import React, { Component } from "react";
import * as d3 from "d3";
import "../App.css";

export default class IndiaMap2 extends Component {
  constructor(props) {
    super(props);
    this.myref = React.createRef();
  }

  componentDidMount() {
    const data = [ 2, 4, 2, 6, 8 ]
    this.drawBarChart(data)
  }

  drawBarChart(data) {
    const canvasHeight = 400;
    const canvasWidth = 600;
    const scale = 20;
    const svgCanvas = d3.select(this.myref.current)
        .append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)
        .style("border", "1px solid black");

    svgCanvas.selectAll("rect")
        .data(data).enter()
            .append("rect")
            .attr("width", 40)
            .attr("height", (datapoint) => datapoint * scale)
            .attr("fill", "orange")
            .attr("x", (datapoint, iteration) => iteration * 45)
            .attr("y", (datapoint) => canvasHeight - datapoint * scale);
    }

  render() {
    return <div ref={this.myref} className="map"></div>

  }
}