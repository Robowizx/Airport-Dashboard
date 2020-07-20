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
    this.state = {
      date: moment().format("YYYY-MM-DD"),
      sdate: moment().format("YYYY-MM-DD"),
      edate: moment().add(10, "days"),
      sec: "by device",
    };
    this.state = {
      ...this.state,
      url1: `https://localhost:4000/Kolkata/guage/minExp/?date=${this.state.date}`,
    };
    this.state = {
      ...this.state,
      url1_1: `https://localhost:4000/Kolkata/guage/maxExp/?date=${this.state.date}`,
    };
    this.state = {
      ...this.state,
      url2: `https://localhost:4000/Kolkata/devExp/?date=${this.state.date}`,
    };

    this.state = {
      ...this.state,
      url3: `https://localhost:4000/Kolkata/total_resp/${this.state.sec}/?sdate=${this.state.stdate}&edate=${this.state.edate}`,
    };
  }

  handleDateChange = (date) => {
    this.setState({
      date: moment(date).format("YYYY-MM-DD"),
      url1: `https://localhost:4000/Kolkata/guage/minExp/?date=${moment(
        date
      ).format("YYYY-MM-DD")}`,
      url1_1: `https://localhost:4000/Kolkata/guage/maxExp/?date=${moment(
        date
      ).format("YYYY-MM-DD")}`,
      url2: `https://localhost:4000/Kolkata/devExp/?date=${moment(date).format(
        "YYYY-MM-DD"
      )}`,
    });
  };
  handleSdateChange = (date) => {
    this.setState({
      sdate: moment(date).format("YYYY-MM-DD"),
      url3: `https://localhost:4000/Kolkata/total_resp/${
        this.state.sec
      }/?sdate=${moment(date).format("YYYY-MM-DD")}&edate=${this.state.edate}`,
    });
  };
  handleEdateChange = (date) => {
    this.setState({
      edate: moment(date).format("YYYY-MM-DD"),
      url3: `https://localhost:4000/Kolkata/total_resp/${
        this.state.sec
      }/?sdate=${this.state.sdate}&edate=${moment(date).format("YYYY-MM-DD")}`,
    });
  };
  handleSecChange = (event) => {
    this.setState({
      sec: event.target.value,
      url3: `https://localhost:4000/Kolkata/total_resp/${event.target.value}/?sdate=${this.state.sdate}&edate=${this.state.edate}`,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    function getContent1(url1) {
      const authToken =
        "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
      const header = {
        Authorization: "Basic " + authToken,
      };
      const iframe = document.getElementById("ifm1").contentDocument;
      fetch(url1, { method: "GET", headers: header })
        .then((response) => {
          iframe.write(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    function getContent2(url1_1) {
      const authToken =
        "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
      const header = {
        Authorization: "Basic " + authToken,
      };
      const iframe = document.getElementById("ifm2").contentDocument;
      fetch(url1_1, { method: "GET", headers: header })
        .then((response) => {
          iframe.write(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    function getContent3(url2) {
      const authToken =
        "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
      const header = {
        Authorization: "Basic " + authToken,
      };
      const iframe = document.getElementById("ifm3").contentDocument;
      fetch(url2, { method: "GET", headers: header })
        .then((response) => {
          iframe.write(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    function getContent4(url3) {
      const authToken =
        "OWZHZGc3b2liUm1iRkJsTHY0c1Q5M2FVY2Iwc1d2amtHM2ZiTnNJZkZCeUhiZjVaaHdvUk45NHN5MEpBeVFsVA==";
      const header = {
        Authorization: "Basic " + authToken,
      };
      const iframe = document.getElementById("ifm4").contentDocument;
      fetch(url3, { method: "GET", headers: header })
        .then((response) => {
          iframe.write(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
                  id="date-picker1"
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
                  id="date-picker1"
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
          <Container>
            <iframe id="ifm1"></iframe>
            <iframe id="ifm2"></iframe>
          </Container>
          <Container>
            <iframe id="ifm3"></iframe>
            <iframe id="ifm4"></iframe>
          </Container>
        </div>
      </div>
    );
  }
}
