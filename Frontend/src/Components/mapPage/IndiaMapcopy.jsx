import React, { Component } from "react";
import * as d3 from 'd3';
import * as topojson from "topojson-client";

import { Link } from "react-router-dom";

import "../../App.css";
import CardInfo from './CardInfo';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import GridList from '@material-ui/core/GridList';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  gridList: {
    width: 500,
    height: 450,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default class IndiaMap extends Component {

  constructor(props) {
    super(props);
    this.myref = React.createRef();
    this.myref2 = React.createRef();
    this.state = {
      isLoading: true,
      airport: "India",
      tooltipName: "",
      date: "2020-03-04",
      prevState: null,
      airState: "All",
      device: "All",
      airType: "all",
      clickState: "",
      deviceList: [
        "CM",
        "DF",
        "EI",
        "EV",
        "FG",
        "RF",
        "RT",
        "SC",
        "TP",
        "TR"],
      stateList: [],
      jsonData: [],
      topAir: [],
      lestAir: [],
      b_alignment: "all",
    };
  }

  async componentDidMount() {
    const url = "https://localhost:4000/graphql";
    const respones = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
        air_list {
          airport_name
          exp
          name
          state
          devices {
            device_name
            exp
          }
          atype
          location {
            lat
            long
          }
        } 
      }` }),
    });
    const data = await respones.json();
    // console.log("test", data.data.air_list[0].devices[0].device_name);
    await data.data.air_list.forEach((e) => this.state.stateList.push(e.state));
    this.state.stateList = this.state.stateList.sort();
    this.state.stateList = Array.from(new Set(this.state.stateList));
    this.setState({ jsonData: data.data.air_list });

    const respones1 = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
          best_worst(order: -1) {
            airport_name
            state
            atype
            exp
            num_of_devs
          }
        }` }),
    });
    const data1 = await respones1.json();
    // await data1.data.best_worst.forEach((e) => this.state.lestAir.push(e.airport_name));
    await this.setState({ topAir: data1.data.best_worst });
    console.log(this.state.best_worst);

    const respones2 = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
          best_worst(order: 1) {
            airport_name
            state
            atype
            exp
            num_of_devs
          }
        }` }),
    });
    const data2 = await respones2.json();
    // await data2.data.best_worst.forEach((e) => this.state.topAir.push(e.airport_name));
    await this.setState({ lestAir: data2.data.best_worst });
    console.log(this.state.lestAir);
    
    this.setState({ isLoading: false });
    this.drawMap();
    this.drawMapPoint();
  }

  componentDidUpdate(prevProps, preState, snapshot) {
    if (this.state.device !== preState.device) {
      d3.select(this.myref.current).select("svg").select("g").remove();
      this.drawMapPoint();
    }
    if (this.state.airState !== preState.airState || this.state.airType !== preState.airType){
      d3.select(this.myref.current).select("svg").remove();
      this.drawMap();
      this.drawMapPoint();
    }
  }

  drawMap() {

    console.log(Number(window.innerWidth / 2), Number(window.innerHeight / 2));
    let width = Number(window.innerWidth / 2);
    let height = Number(window.innerHeight) - 90;

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

    let svg = d3.select(this.myref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    d3.json('india.json')
      .then((indb) => {
        indb = topojson.feature(indb, indb.objects['india-states']);
        const projection = d3.geoMercator().fitSize([+svg.attr('width'), +svg.attr('height')], indb);
        const path = d3.geoPath().projection(projection);

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
            if(!this.state.isLoading){
            this.drawMapPoint();}
            tooltip.text(`${d.id}`);
            tooltip.style("visibility", "visible");
          })
          .on('mouseout', (d, i, n) => {
            if (n[i] !== this.state.prevState) {
              if(!this.state.isLoading){
              this.drawMapPoint();}
              n[i].style.stroke = 'black';
              n[i].style.fill = '#f7fbfd';
            }
            tooltip.style("visibility", "hidden");
          })
          .on('mousemove', () => {
            tooltip.style("top", `${d3.event.pageY - 30}px`)
              .style("left", `${d3.event.pageX - 50}px`);
          })
      });
  }

  drawMapPoint() {

    let t = "";
    console.log(Number(window.innerWidth / 2), Number(window.innerHeight / 2));
    let width = Number(window.innerWidth / 2);
    let height = Number(window.innerHeight) - 90;

    let expTip = d3.select(this.myref2.current);

    let svg = d3.select(this.myref.current)
      .select("svg");

    d3.json('india.json')
      .then((indb) => {
        indb = topojson.feature(indb, indb.objects['india-states']);
        const projection = d3.geoMercator().fitSize([+svg.attr('width'), +svg.attr('height')], indb);
        let statePoints = svg.append("g");
        statePoints.selectAll(".pin")
            .data(this.state.jsonData)
            .enter()
            .append("circle", ".pin")
            .attr("r", 3)
            .style("stroke", "#000")
            .style("stroke-width", 0.3)
            .attr("fill", (d) => {
              if (this.state.device === "All") {
                if (d.exp >= 0 && d.exp <= 50)
                  return "red"
                if (d.exp >= 50 && d.exp <= 70)
                  return "orange"
                if (d.exp >= 70 && d.exp <= 100)
                  return "green"
              }
              for (var i = 0; i < d.devices.length; i++) {
                if (d.devices[i].device_name === this.state.device) {
                  if (d.devices[i].exp >= 0 && d.devices[i].exp <= 50)
                    return "red"
                  if (d.devices[i].exp >= 50 && d.devices[i].exp <= 70)
                    return "orange"
                  if (d.devices[i].exp >= 70 && d.devices[i].exp <= 100)
                    return "green"
                }
              }
            })
            .attr("transform", (d) => {
              if (this.state.airState === "All") {
                if (this.state.airType === "all")
                  return (`translate(${projection([d.location.long, d.location.lat])})`);
                if (this.state.airType === d.atype)
                  return (`translate(${projection([d.location.long, d.location.lat])})`);
              }
              if (this.state.airState === d.state) {
                if (this.state.airType === "all")
                  return (`translate(${projection([d.location.long, d.location.lat])})`);
                if (this.state.airType === d.atype)
                  return (`translate(${projection([d.location.long, d.location.lat])})`);
              }
            })
            .on('mouseover', (d, i, n) => {
              expTip.style("top", `${d3.event.pageY - 80}px`)
                .style("left", `${d3.event.pageX - 50}px`);
              d3.select(document.getElementById('airname')).text(`${d.airport_name}`);
              d3.select(document.getElementById('exp')).text(`Exp-Index : ${parseFloat(d.exp).toFixed(2)}`)
              expTip.style("visibility", "visible");
              t = n[i].style.fill;
              n[i].style.fill = '#818181';

            })
            .on('mouseout', (d, i, n) => {
              expTip.style("visibility", "hidden");
              n[i].style.fill = t;
            })
            .on('click', async (d) => {
              await this.setState({ clickState: `${d.name}` });
              if (this.state.device === "All") {
                await this.props.updateState(this.state.clickState, this.state.date, "EI");
              } else {
                await this.props.updateState(this.state.clickState, this.state.date, this.state.device)
              }
              console.log(this.state.clickState, this.state.date, this.state.device);
              document.getElementById('linkTest').click();
            });
          });
  }

  statesChange = event => {
    this.setState({ airState: (event.target.value) });
  };

  deviceChange = event => {
    this.setState({ device: (event.target.value) });
  };

  handleAlignment = (event, value) => {
    this.setState({ airType: (value) });
    this.setState({ b_alignment: (value) });
  }

  render() {

    return (
      <div className="mainMapPage">
        {this.state.isLoading ? <div><CircularProgress className="centered" /></div> :
          <div>
            <div ref={this.myref} className="map">
            </div>
            <div className="pageCard">
              <CardInfo width={Number(window.innerWidth) / 2 - 60} height="auto" cn="card">
                <div className={useStyles.root}>
                  <Grid container direction="row" justify="flex-end" alignItems="center" spacing={1}>
                    <Grid item xs>
                      <FormControl size="small" className={useStyles.formControl}>
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
                          {this.state.stateList.map((e, i) => <MenuItem value={e} key={i}>{e}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl size="small" className={useStyles.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Facilites</InputLabel>
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
                          <MenuItem value="" disabled>Facilites</MenuItem>
                          <MenuItem value="All">All</MenuItem>
                          {this.state.deviceList.map((obj, i) => <MenuItem value={obj} key={i}>{obj}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs></Grid>
                    <div className={useStyles.root}>
                      <ToggleButtonGroup value={this.state.b_alignment} exclusive size="small" onChange={this.handleAlignment}>
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="dom">Domestic</ToggleButton>
                        <ToggleButton value="int">International</ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </Grid>
                </div>
                <br />
                {this.state.airState === "All" ?
                  <div>
                    <GridList cellHeight={"auto"} className={useStyles.gridList} cols={2}>
                      <Grid container direction="column" justify="flex-start" alignItems="center" spacing={1}>
                        <h3>Best Airports</h3>
                        {this.state.topAir.map((e, i) => <Grid item xs key={i}>
                          <CardInfo width={(Number(window.innerWidth) / 2) / 2.5}>
                            <p className="textP">{e.airport_name}</p>
                            <p className="textP">{e.atype === "int" ? "International" : "Domestic"}</p>
                            <p className="textP">{e.state}</p>
                            <p className="textP">{parseFloat(e.exp).toFixed(2)}</p>
                          </CardInfo>
                        </Grid>)}
                      </Grid>
                      <Grid container direction="column" justify="flex-start" alignItems="center" spacing={1}>
                        <h3>Worst Airports</h3>
                        {this.state.lestAir.map((e, i) => <Grid item xs key={i}>
                          <CardInfo width={(Number(window.innerWidth) / 2) / 2.5}>
                            <p className="textP">{e.airport_name}</p>
                            <p className="textP">{e.atype === "int" ? "International" : "Domestic"}</p>
                            <p className="textP">{e.state}</p>
                            <p className="textP">{parseFloat(e.exp).toFixed(2)}</p>
                          </CardInfo>
                        </Grid>)}
                      </Grid>
                    </GridList>
                  </div>
                  :
                  <div>
                    <Grid container direction="column" justify="flex-end" alignItems="flex-start" spacing={1}>
                      {this.state.jsonData.map((e, i) => {
                        if (e.state === this.state.airState)
                          return (
                            <Grid item xs key={i}>
                              <CardInfo>
                                <p className="textP">{e.airport_name}</p>
                                <p className="textP">{e.atype === "int" ? "International" : "Domestic"}</p>
                                <p className="textP">{e.state}</p>
                                <p className="textP">{parseFloat(e.exp).toFixed(2)}</p>
                              </CardInfo>
                            </Grid>);
                      }
                      )}
                    </Grid>
                  </div>
                }
              </CardInfo>
            </div>
            <div ref={this.myref2} className="toolTip">
              <p id="airname" className="textP"></p>
              <p id="exp" className="textP"></p>
            </div>
            <Link to="/airport" id="linkTest" ></Link>
          </div>
        }
      </div>
    );
  }
}