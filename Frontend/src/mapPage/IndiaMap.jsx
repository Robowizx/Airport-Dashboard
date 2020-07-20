import React, { Component } from "react";
import * as d3 from 'd3';
import * as topojson from "topojson-client";
import "../App.css";
import CardInfo from './CardInfo';
import places from './aaiList.json';

export default class IndiaMap extends Component {
  constructor(props) {
    super(props);
    this.myref = React.createRef();
    this.myref2 = React.createRef();
    this.state = {
      airport: "India",
      tooltipName: "",
      date: "",
      prevState: null
    }
  }

  componentDidMount() {
    this.drawBarChart()
  }

  drawBarChart() {
    let width = 600;
    let height = 520;

    var tooltip = d3.select(this.myref.current)
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("padding", "10px")
      .style("visibility", "hidden")
      .style("background", "#ffffff")
      .style("color", "#000")
      .style("border", "1px solid black")
      .style("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)")
      .text("");

    let svg = d3.select(this.myref.current).append("svg")
      .attr("width", width)
      .attr("height", height);

    d3.json('india.json')
      .then((indb) => {
        indb = topojson.feature(indb, indb.objects['india-states']);
        const projection = d3.geoMercator().fitSize([+svg.attr('width'), +svg.attr('height')], indb);
        const path = d3.geoPath().projection(projection);
        let cp = () => {
          let statePoints = svg.append("g");
          statePoints.selectAll(".pin")
            .data(places)
            .enter()
            .append("circle", ".pin")
            .attr("r", 2)
            .attr("fill", "red")
            .attr("transform", (d) => {
              return `translate(${projection([d.location.longitude,
              d.location.latitude])})`
            })
            .on('mouseover',(d,i,n)=>{
              tooltip.text(`${d.name}`);
              tooltip.style("visibility", "visible");
            });
        }
        svg.selectAll('path')
          .data(indb.features)
          .enter()
          .append('path')
          .attr('id', (d) => d.id)
          .attr('stroke-width', 0.5)
          .attr('style', 'stroke: black; fill: #f7fbfd')
          .attr('d', path)
          .on('mouseover', (d, i, n) => {
            n[i].style.stroke = 'blue';
            n[i].style.fill = 'lightblue';
            n[i].parentElement.appendChild(n[i]);
            tooltip.text(`${d.id}`);
            tooltip.style("visibility", "visible");
            cp();
          })
          .on('mouseout', (d, i, n) => {
            if (n[i] != this.state.prevState) {
              n[i].style.stroke = 'black';
              n[i].style.fill = '#f7fbfd';
            }
            tooltip.style("visibility", "hidden");
            cp();
          })
          .on("mousemove", () => {
            tooltip.style("top", `${d3.event.pageY - 50}px`)
              .style("left", `${d3.event.pageX - 50}px`);
            cp();
          })
          .on('click', (d, i, n) => {
            if (this.state.prevState != n[i]) {
              this.setState({ airport: `${d.id}` });
              n[i].style.stroke = 'blue';
              n[i].style.fill = 'lightblue';
              if (this.state.prevState != null) {
                this.state.prevState.style.stroke = 'black';
                this.state.prevState.style.fill = '#f7fbfd';
              }
              this.setState({ prevState: n[i] });
              cp();
            }
          });
      });
  }


  render() {
    return (
      <div>
        <div ref={this.myref} className="map">
          <CardInfo width="600" height="300">
            <h1 className="stateName">{this.state.airport}</h1>
          </CardInfo>
        </div>
      </div>)
  }
}