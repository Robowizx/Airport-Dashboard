import React, { Component } from "react";
import * as d3 from 'd3';
import * as topojson from "topojson-client";
import places from './aaiList.json';

import { Link } from "react-router-dom";

import "../../App.css";
import CardInfo from './CardInfo';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';

const deviceList = [
  "CM",
  "DF",
  "EI",
  "EV",
  "FG",
  "RF",
  "RT",
  "SC",
  "TP",
  "TR"];

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
  },
}));

const color = {
  "CM": "#0000FF",
  "DF": "#f7ba59",
  "EI": "#f75b8d",
  "EV": "#44c2fd",
  "FG": "#f7eb5b",
  "RF": "#ff8f66",
  "RT": "#647d32",
  "SC": "#ccff66",
  "TP": "#8c61ff",
  "TR": "#40ad6c"
};

export default class IndiaMap extends Component {
  constructor(props) {
    super(props);
    this.myref = React.createRef();
    this.myref2 = React.createRef();
    this.state = {
      airport: "India",
      tooltipName: "",
      date: "2020-03-04",
      prevState: null,
      airState: "All",
      device: "All",
      airType: "All",
      clickState: "",
    }
  }

  componentDidMount() {
    this.drawMap();
  }

  componentDidUpdate(prevProps, preState, snapshot) {
    if (this.state.airState !== preState.airState || this.state.device !== preState.device || this.state.airType !== preState.airType) {
      d3.select(this.myref.current).selectAll("svg").remove();
      this.drawMap();
    }
  }

  drawMap() {

    let t = "";

    let width = 600;
    let height = 560;

    let tooltip = d3.select(this.myref.current)
      .append("div")
      .style("position", "absolute")
      .style("z-index", "1")
      .style("padding", "10px")
      .style("visibility", "hidden")
      .style("background", "#818181")
      .style("color", "#ffffff")
      .style("border-radius", "5px")
      .style("border", "1px solid #818181")
      .style("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)")
      .text("");

    let expTip = d3.select(this.myref2.current);

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
            .attr("r", 2.8)
            .attr("fill", (d) => {
              if (this.state.device === "All") {
                return "red"
              }
              if (d.devices.includes(`${this.state.device}`)) {
                return color[this.state.device];
              }
            })
            .attr("transform", (d) => {
              if (this.state.airState === "All") {
                if (this.state.airType === "All")
                  return (`translate(${projection([d.location.longitude, d.location.latitude])})`);
                if (this.state.airType === d.airType)
                  return (`translate(${projection([d.location.longitude, d.location.latitude])})`);
              }
              if (this.state.airState === d.airState) {
                if (this.state.airType === "All")
                  return (`translate(${projection([d.location.longitude, d.location.latitude])})`);
                if (this.state.airType === d.airType)
                  return (`translate(${projection([d.location.longitude, d.location.latitude])})`);
              }
            })
            .on('mouseover', (d, i, n) => {
              expTip.style("top", `${d3.event.pageY - 80}px`)
                .style("left", `${d3.event.pageX - 50}px`);
              d3.select(document.getElementById('airname')).text(`${d.airName}`);
              d3.select(document.getElementById('exp')).text(`Exp-Index : ${d.Exp}`)
              expTip.style("visibility", "visible");
              t = n[i].style.fill;
              n[i].style.fill = '#818181';
            })
            .on('mouseout', (d, i, n) => {
              expTip.style("visibility", "hidden");
              n[i].style.fill = t;
            })
            .on('click', async (d) => {
              await this.setState({ clickState: `${d.city}` });
              if (this.state.device === "All") {
                await this.props.updateState(this.state.clickState, this.state.date, "EI");
              } else {
                await this.props.updateState(this.state.clickState, this.state.date, this.state.device)
              }
              console.log(this.state.clickState, this.state.date, this.state.device);
              document.getElementById('linkTest').click();
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
            if (n[i] !== this.state.prevState) {
              n[i].style.stroke = 'black';
              n[i].style.fill = '#f7fbfd';
            }
            tooltip.style("visibility", "hidden");
            cp();
          })
          .on('mousemove', () => {
            tooltip.style("top", `${d3.event.pageY - 50}px`)
              .style("left", `${d3.event.pageX - 50}px`);
            cp();
          })
        cp();
      });
  }

  statesChange = event => {
    this.setState({ airState: (event.target.value) });
  };

  deviceChange = event => {
    this.setState({ device: (event.target.value) });
  };

  render() {
    return (
      <div className="mainMapPage">
        <div ref={this.myref} className="map">
          <CardInfo width="600" height="300">
            <div className={useStyles.root}>
              <Grid container direction="row" justify="flex-end" alignItems="center" spacing={1}>
                <Grid item xs>
                  <FormControl size="small" variant="outlined" className={useStyles.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">State</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="State"
                      displayEmpty
                      value={this.state.airState}
                      className={useStyles.selectEmpty}
                      onChange={this.statesChange}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="" disabled>State</MenuItem>
                      <MenuItem value={"All"}>All</MenuItem>
                      <MenuItem value={"Andaman and Nicobar"}>Andaman and Nicobar</MenuItem>
                      <MenuItem value={"Andhra pradesh"}>Andhra pradesh</MenuItem>
                      <MenuItem value={"Arunachal Pradesh"}>Arunachal Pradesh</MenuItem>
                      <MenuItem value={"Assam"}>Assam</MenuItem>
                      <MenuItem value={"Bihar"}>Bihar</MenuItem>
                      <MenuItem value={"Chhattisgarh"}>Chhattisgarh</MenuItem>
                      <MenuItem value={"Delhi"}>Delhi</MenuItem>
                      <MenuItem value={"Goa"}>Goa</MenuItem>
                      <MenuItem value={"Gujarat"}>Gujarat</MenuItem>
                      <MenuItem value={"Haryana"}>Haryana</MenuItem>
                      <MenuItem value={"Himachal Pradesh"}>Himachal Pradesh</MenuItem>
                      <MenuItem value={"‎Jammu and Kashmir"}>Jammu and Kashmir</MenuItem>
                      <MenuItem value={"‎Jharkhand"}>‎Jharkhand</MenuItem>
                      <MenuItem value={"Karnataka"}>Karnataka</MenuItem>
                      <MenuItem value={"‎Kerala"}>‎Kerala</MenuItem>
                      <MenuItem value={"Ladakh"}>Ladakh</MenuItem>
                      <MenuItem value={"Madhya Pradesh"}>Madhya Pradesh</MenuItem>
                      <MenuItem value={"Maharashtra"}>Maharashtra</MenuItem>
                      <MenuItem value={"Manipur"}>Manipur</MenuItem>
                      <MenuItem value={"Meghalaya"}>Meghalaya</MenuItem>
                      <MenuItem value={"Mizoram"}>Mizoram</MenuItem>
                      <MenuItem value={"Nagaland"}>Nagaland</MenuItem>
                      <MenuItem value={"Odisha"}>Odisha</MenuItem>
                      <MenuItem value={"Punjab"}>Punjab</MenuItem>
                      <MenuItem value={"Rajasthan"}>Rajasthan</MenuItem>
                      <MenuItem value={"Sikkim"}>Sikkim</MenuItem>
                      <MenuItem value={"Tamil Nadu"}>Tamil Nadu</MenuItem>
                      <MenuItem value={"Telangana"}>Telangana</MenuItem>
                      <MenuItem value={"Tripura"}>Tripura</MenuItem>
                      <MenuItem value={"Uttar Pradesh"}>Uttar Pradesh</MenuItem>
                      <MenuItem value={"Uttarakhand"}>Uttarakhand</MenuItem>
                      <MenuItem value={"West Bengal"}>West Bengal</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs>
                  <FormControl size="small" variant="outlined" className={useStyles.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Device</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="Device"
                      displayEmpty
                      value={this.state.device}
                      className={useStyles.selectEmpty}
                      onChange={this.deviceChange}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="" disabled>Device</MenuItem>
                      <MenuItem value="All">All</MenuItem>
                      {deviceList.map((obj, i) => <MenuItem value={obj} key={i}>{obj}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs></Grid>
                <div className={useStyles.root}>
                  <ButtonGroup size="small" color="primary" aria-label="outlined primary button group">
                    <Button onClick={() => { return this.setState({ airType: "All" }) }}>All</Button>
                    <Button onClick={() => { return this.setState({ airType: "DOMESTIC" }) }}>Domestic</Button>
                    <Button onClick={() => { return this.setState({ airType: "International" }) }}>International</Button>
                  </ButtonGroup>
                </div>
              </Grid>
            </div>
            <hr />
          </CardInfo>
        </div>
        <div ref={this.myref2} className="toolTip">
          <p id="airname" className="textP"></p>
          <p id="exp" className="textP"></p>
        </div>
        <Link to="/airport" id="linkTest" ></Link>
      </div>
    );
  }
}