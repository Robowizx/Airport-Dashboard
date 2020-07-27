import React, { Component } from "react";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import Container from "@material-ui/core/Container";
import { Grid, Divider } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const moment = require("moment-timezone");

export default class SimpleTabs extends Component {
  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSdateChange = this.handleSdateChange.bind(this);
    this.handleSecChange = this.handleSecChange.bind(this);
    this.handleEdateChange = this.handleEdateChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      airport: "",
      date: moment().format("YYYY-MM-DD"),
      sdate: moment().subtract(10, "days").format("YYYY-MM-DD"),
      edate: moment().format("YYYY-MM-DD"),
      sec: "by_device",
    };    
    this.state = {
      ...this.state,
      url1: `http://localhost:4000/Kolkata/guage/minExp/?date=${this.state.date}`,
    };
    this.state = {
      ...this.state,
      url1_1: `http://localhost:4000/Kolkata/guage/maxExp/?date=${this.state.date}`,
    };
    this.state = {
      ...this.state,
      url2: `http://localhost:4000/Kolkata/devExp/?date=${this.state.date}`,
    };

    this.state = {
      ...this.state,
      url3: `http://localhost:4000/Kolkata/total_resp/${this.state.sec}/?sdate=${this.state.sdate}&edate=${this.state.edate}`,
    };
  }
  handleDateChange = (date) => {
    this.setState({
      date: moment(date).format("YYYY-MM-DD"),
      url1: `http://localhost:4000/Kolkata/guage/minExp/?date=${moment(
        date 
      ).format("YYYY-MM-DD")}`,
      url1_1: `http://localhost:4000/Kolkata/guage/maxExp/?date=${moment(
        date
      ).format("YYYY-MM-DD")}`,
      url2: `http://localhost:4000/Kolkata/devExp/?date=${moment(date).format(
        "YYYY-MM-DD"
      )}`,
    });
  };
  handleSdateChange = (date) => {
    this.setState({
      sdate: moment(date).format("YYYY-MM-DD"),
      url3: `http://localhost:4000/Kolkata/total_resp/${
        this.state.sec
      }/?sdate=${moment(date).format("YYYY-MM-DD")}&edate=${this.state.edate}`,
    });
  };
  handleEdateChange = (date) => {
    this.setState({
      edate: moment(date).format("YYYY-MM-DD"),
      url3: `http://localhost:4000/Kolkata/total_resp/${
        this.state.sec
      }/?sdate=${this.state.sdate}&edate=${moment(date).format("YYYY-MM-DD")}`,
    });
  };
  handleSecChange = (event) => {
    this.setState({
      sec: event.target.value,
      url3: `http://localhost:4000/Kolkata/total_resp/${event.target.value}/?sdate=${this.state.sdate}&edate=${this.state.edate}`,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  
  

  render() {
        return (
      <div>
        <div>
          <Container style={{ paddingtop: "50px" }}>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker1"
                  label="Date"
                  format="yyyy-MM-dd"
                  value={this.state.date}
                  onChange={this.handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker2"
                  label="Start Date"
                  format="yyyy-MM-dd"
                  value={this.state.sdate}
                  onChange={this.handleSdateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker3"
                  label="End Date"
                  format="yyyy-MM-dd"
                  value={this.state.edate}
                  onChange={this.handleEdateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <Grid item xs={2} sm={1}>
                <FormControl>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Section
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    defaultValue={"by_device"}
                    open={this.state.open}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    value={this.state.sec}
                    onChange={this.handleSecChange}
                    autoWidth
                  >
                    <MenuItem value={"by_device"}>By Device</MenuItem>
                    <MenuItem value={"by_survey"}>By Survey</MenuItem>
                    <MenuItem value={"by_group"}>By Group</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Container>
        </div>
        <Divider />

        <div>
          <Container display="flex" position="relative">
            <iframe
            src={this.state.url1_1}
            id="ifm1"
              title="top exp guage"
              width="30%"
              height="400"
              frameBorder="0"
            ></iframe>
            <iframe
             src={this.state.url1}
              id="ifm2"
              title="least exp guage"
              width="30%"
              height="400"
              frameBorder="0"
            ></iframe>
          </Container>
          <Container>
            <iframe
            src={this.state.url2}
              id="ifm3"
              title="exp tiil date"
              width="50%"
              height="500"
              frameBorder="0"
            ></iframe>
            <iframe
            src={this.state.url3}
              id="ifm4"
              title="heatmap"
              width="50%"
              height="500"
              frameBorder="0"
            ></iframe>
          </Container>
        </div>
      </div>
    );
  }
}