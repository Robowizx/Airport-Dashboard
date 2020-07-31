import React, { Component } from "react";
import * as d3 from 'd3';
import * as topojson from "topojson-client";

import { Link } from "react-router-dom";

import "../../App.css";
import CardInfo from './CardInfo';
import GaugeChart from "./gaugeChart";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

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
      airState: props.curstate !== null ? props.curstate : "All",
      device: "All",
      airType: "all",
      clickState: "",
      deviceList: [],
      stateList: [],
      jsonData: [],
      topAir: [],
      lestAir: [],
      b_alignment: "all",
    };
    this.option = React.createRef();
    this.option.current = {
      menu: {
        airport: [],
        states: []
      },
      headers: {
        state: null
      },
      airport: null
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
            name
            airport_name
            state
            atype
            exp
            num_of_devs
          }
        }` }),
    });
    const data1 = await respones1.json();
    this.setState({ topAir: data1.data.best_worst });

    const respones2 = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
          best_worst(order: 1) {
            name
            airport_name
            state
            atype
            exp
            num_of_devs
          }
        }` }),
    });
    const data2 = await respones2.json();
    this.setState({ lestAir: data2.data.best_worst });

    const respones3 = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        {
          device_list
        }` }),
    });
    const data3 = await respones3.json();
    this.setState({ deviceList: data3.data.device_list.sort() });
    window.addEventListener('resize', this.resize)
    this.setState({ isLoading: false });
    this.drawMap();
    console.log(window.innerWidth);
  }

  async componentDidUpdate(prevProps, preState, snapshot) {
    if (this.state.airState !== preState.airState || this.state.device !== preState.device || this.state.airType !== preState.airType) {
      d3.select(this.myref.current).select("svg").remove();
      this.drawMap();
    }
  }

  drawMap() {

    let t = "";
    let width = Number(window.innerWidth / 2) - 100;
    let height = Number(window.innerHeight) - 100;

    let tooltip = d3.select(this.myref.current)
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("padding", "10px")
      .style("visibility", "hidden")
      .style("background", "#424242")
      .style("color", "#ffffff")
      .style("border-radius", "5px")
      .style("border", "1px solid #424242")
      .style("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)")
      .text("");

    let expTip = d3.select(this.myref2.current);

    let svg = d3.select(this.myref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    
    d3.json('india.json')
      .then((indb) => {
        indb = topojson.feature(indb, indb.objects['india-states']);
        const projection = d3.geoMercator().fitSize([svg.attr('width'), svg.attr('height')], indb);
        const path = d3.geoPath().projection(projection);

        let cp = () => {
          svg.selectAll("circle")
            .data(this.state.jsonData)
            .enter()
            .append("circle")
            .attr("r",
              window.innerWidth > 1366 ? 6 : 3.5
            )
            .attr("fill", (d) => {
              if (this.state.device === "All") {
                if (d.exp >= 0 && d.exp < 33) {
                  return "#FF2F2F";
                }
                if (d.exp >= 33 && d.exp < 66) {
                  return "#faed27";
                }
                if (d.exp >= 66 && d.exp <= 100) {
                  return "#00FF00";
                }
              }
         
                for (var i = 0; i < d.devices.length; i++) {
                  if (d.devices[i].device_name === this.state.device) {
                    if (d.devices[i].exp >= 0 && d.devices[i].exp < 33)
                      return "#FF2F2F";
                    if (d.devices[i].exp >= 33 && d.devices[i].exp < 66)
                      return "#faed27";
                    if (d.devices[i].exp >= 66 && d.devices[i].exp <= 100)
                      return "#00FF00";
                  }
                }
            })
            .attr("transform", (d) => {
              if (this.state.airState === "All") {
                if (this.state.airType === "all") {
                  return "translate("+ projection([d.location.long, d.location.lat])+")";
                }
                if (this.state.airType === d.atype) {
                  return "translate("+ projection([d.location.long, d.location.lat])+")";
                }
              }
              if (this.state.airState === `${d.state}`) {
                if (this.state.airType === "all") {
                  return "translate("+ projection([d.location.long, d.location.lat])+")";
                }
                if (this.state.airType === d.atype) {
                  return "translate("+ projection([d.location.long, d.location.lat])+")";
                }
              }
            })
            .on('mouseover', (d, i, n) => {
              expTip.style("top", `${d3.event.pageY - 70}px`)
                .style("left", `${d3.event.pageX - 50}px`);
              d3.select(document.getElementById('airname')).text(`${d.airport_name}`);
              let exp;
              if (this.state.device === "All") {
                exp = parseFloat(d.exp).toFixed(2);
              } else {
                for (var i = 0; i < d.devices.length; i++) {
                  if (d.devices[i].device_name === this.state.device) {
                    exp = parseFloat(d.devices[i].exp).toFixed(2);
                  }
                }
              }
              d3.select(document.getElementById('exp')).text(`Exp-Index : ${exp}`);
              expTip.style("visibility", "visible");
            })
            .on('mouseout', (d, i, n) => {
              expTip.style("visibility", "hidden");
            })
            .on('click', (d) => {
              this.option.current.headers.state = d.state;
              this.option.current.airport = d.name;
              for (let i = 0; i < this.state.jsonData.length; i++) {
                if (this.state.jsonData[i].state == d.state)
                  this.option.current.menu.airport.push(this.state.jsonData[i].name);
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
          .attr('stroke-width', 1)
          .attr('stroke', '#fff')
          .attr('fill', (d)=>{
            if(this.state.airState === "All"){
              return "#424242"
            }
            if(this.state.airState === d.id){
              return "#000"
            }else{
              return "#424242"
            }
          })
          .attr('d', path)
          .on('mouseover', (d, i, n) => {
            n[i].style.stroke = '#fff';
            n[i].style.fill = '#505050';
            // n[i].parentElement.appendChild(n[i]);
            tooltip.text(`${d.id}`);
            tooltip.style("visibility", "visible");
            cp();
          })
          .on('mouseout', (d, i, n) => {
            if (n[i] !== this.state.prevState) {
              n[i].style.stroke = '#fff';
              if(this.state.airState === d.id){
                n[i].style.fill = '#000';
              }else{
                n[i].style.fill = '#424242';
              }
            }
            tooltip.style("visibility", "hidden");
            cp();
          })
          .on('mousemove', () => {
            tooltip.style("top", `${d3.event.pageY - 20}px`)
              .style("left", `${d3.event.pageX - 100}px`);
            cp();
          })
        cp();
      });
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

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


  async handleLink(state, name) {
    this.option.current.headers.state = state;
    this.option.current.airport = name;
    for (let i = 0; i < this.state.jsonData.length; i++) {
      if (this.state.jsonData[i].state == state)
        this.option.current.menu.airport.push(this.state.jsonData[i].name);
    }
    console.log(this.state.clickState, this.state.date, this.state.device);
    document.getElementById('linkTest').click();
  }

  render() {

    return (
      <div >
        {this.state.isLoading ? <div><CircularProgress className="centered" /></div> :
          <div className="mainMapPage">
            <div ref={this.myref} className="map">
            </div>
            <div className="pageCard">
              <CardInfo width={Number(window.innerWidth) / 2 - 60} height="auto" cn="card">
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
                  <Grid item xs>
                    <ToggleButtonGroup value={this.state.b_alignment} exclusive size="small" onChange={this.handleAlignment}>
                      <ToggleButton value="all"><b>All</b></ToggleButton>
                      <ToggleButton value="dom"><b>Domestic</b></ToggleButton>
                      <ToggleButton value="int"><b>International</b></ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>
                <br />
                {this.state.airState === "All" ?
                  <div className="test">
                    <div className="flex-list-con">
                      <div className="flex-list">
                        <h3 className="h3">Best Airports</h3>
                        {this.state.topAir.map((e, i) =>
                          <div width={(Number(window.innerWidth)) / 2} height={(Number(window.innerheigth)) - 20 / 5} className="f-card" onClick={() => this.handleLink(e.state, e.name)}>
                            <div className="flex-card">
                              <div className="flex-card-1">
                                <GaugeChart exp={parseFloat(e.exp).toFixed(2)} chartType="best" />
                              </div>
                              <div className="flex-card-2">
                                <Typography variant={window.innerWidth > 1366 ? "h6" : "subtitle1"}>{e.name} Airport,</Typography>
                                <Typography variant="subtitle2">{e.state}</Typography>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-list">
                        <h3 className="h3">Worst Airports</h3>
                        {this.state.lestAir.map((e, i) =>
                          <div width={(Number(window.innerWidth)) / 2} height={(Number(window.innerheigth)) - 20 / 5} className="f-card" onClick={() => this.handleLink(e.state, e.name)}>
                            <div className="flex-card">
                              <div className="flex-card-1">
                                <GaugeChart exp={parseFloat(e.exp).toFixed(2)} />
                              </div>
                              <div className="flex-card-2">
                                <Typography variant={window.innerWidth > 1366 ? "h6" : "subtitle1"}>{e.name} Airport,</Typography>
                                <Typography variant="subtitle2">{e.state}</Typography>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  :
                  <div>

                    {this.state.jsonData.map((e, i) => {
                      if (e.state === this.state.airState)
                        return (
                          <div className="f-card" onClick={() => this.handleLink(e.state, e.name)}>
                            <div className="flex-card">
                              <div className="flex-card-1">
                                <GaugeChart exp={parseFloat(e.exp).toFixed(2)} />
                              </div>
                              <div className="flex-card-2">
                                <Typography variant="h6">{e.name} Airport,</Typography>
                                <Typography variant="subtitle2">{e.state}</Typography>
                              </div>
                            </div>
                          </div>
                        );
                    }
                    )}
                  </div>
                }
              </CardInfo>
            </div>
            <div ref={this.myref2} className="toolTip">
              <p id="airname" className="textP"></p>
              <p id="exp" className="textP"></p>
            </div>
            <div className="test2"></div>
            <Link to="/airport" id="linkTest" onClick={() => {
              this.props.change(this.option.current);
            }}></Link>
          </div>
        }
      </div>
    );
  }
}