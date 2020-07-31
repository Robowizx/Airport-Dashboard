import React, { Component } from "react";
import "../../App.css";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TodayIcon from '@material-ui/icons/Today';
import TimelineIcon from '@material-ui/icons/Timeline';

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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default class airportPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      airport: this.props.airState,
      date: this.props.date,
      device: this.props.dev,
      w: window.innerWidth,
      isLoading: true
    };
  }

  async componentDidMount() {
   await this.getContent(
      `https://localhost:4000/${this.state.airport}/res/by_device?date=${this.state.date}&type=${this.state.device}`,
      "ifm1"
    );
    this.setState({isLoading: false});
  }

  componentDidUpdate(prevProps,prevState,snapshot){
    if(this.state.device !== prevState.device){
      this.getContent(
        `https://localhost:4000/${this.state.airport}/res/by_device?date=${this.state.date}&type=${this.state.device}`,
        "ifm1"
      );
    }

  }

  getContent(url1, idChart) {
    const authToken =
      "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
    const header = {
      Authorization: "Basic " + authToken,
    };
    const iframe = document.getElementById(idChart);
    fetch(url1, { method: "GET", headers: header })
      .then((response) => response.text())
      .then((data) => {
        iframe.contentDocument.write(data);
        iframe.contentDocument.close();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deviceChange = event => {
    this.setState({ device: (event.target.value) });
  };

  render() {
    return (
      <div className="air" style={{ width: this.state.w}}>
      <Paper>
        <Tabs aria-label="simple tabs example">
          <Tab label="Daily" icon={<TodayIcon />}/>
          <Tab label="Time Series" icon={<TimelineIcon />}/>
        </Tabs>
        <FormControl
          size="small"
          variant="outlined"
          className={useStyles.formControl}
        >
          <InputLabel id="demo-simple-select-outlined-label">Device</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label="Device"
            displayEmpty
            value={this.state.device}
            className={useStyles.selectEmpty}
            onChange={this.deviceChange}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              Device
            </MenuItem>
            {deviceList.map((obj,i) => <MenuItem value={obj} key={i}>{obj}</MenuItem> )}
          </Select>
        </FormControl>
        </Paper>
        <iframe
          width="600"
          height="500"
          title="exp"
          id="ifm1"
          frameborder="0"
        ></iframe>
        <iframe
          width="600"
          height="500"
          title="exp"
          id="ifm1"
          frameborder="0"
        ></iframe>
      </div>
    );
  }
}
