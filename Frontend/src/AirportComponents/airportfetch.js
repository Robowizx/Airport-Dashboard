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
      airport: "Kolkata",
      date: moment().format("YYYY-MM-DD"),
      sdate: moment().subtract(10, "days").format("YYYY-MM-DD"),
      edate: moment().format("YYYY-MM-DD"),
      sec: "by_device",
     
    };
    
    this.state = {
      ...this.state,
      url1: `https://localhost:4000/Kolkata/guage/minExp/?date=${this.state.date}`,
      url1_1:`https://localhost:4000/Kolkata/guage/maxExp/?date=${this.state.date}`,
      url2: `https://localhost:4000/Kolkata/devExp/?date=${this.state.date}`,
      url3: `https://localhost:4000/Kolkata/total_resp/${this.state.sec}/?sdate=${this.state.sdate}&edate=${this.state.edate}`,
    };
  }
 
  handleDateChange = date => {
    var dates = moment(date).format('YYYY-MM-DD');
  this.setState({ 
    date: dates,
 });
  console.log(this.state);
  this.getContent(`https://localhost:4000/Kolkata/guage/minExp/?date=${dates}`,"ifm1");
    this.getContent(`https://localhost:4000/Kolkata/guage/maxExp/?date=${dates}`,"ifm2");
    this.getContent(`https://localhost:4000/Kolkata/devExp/?date=${dates}`,"ifm3");
}; 
    

handleSdateChange = date => {
  var sdates = moment(date).format('YYYY-MM-DD');
this.setState({ 
  sdate: sdates,
});
console.log(this.state);
this.getContent(`https://localhost:4000/Kolkata/total_resp/${this.state.sec}/?sdate=${sdates}&edate=${this.state.edate}`,"ifm4");
    
};

handleSecChange = (event) => {
  var section=event.target.value;
this.setState({ 
  sec: section,
});
console.log(this.state);
this.getContent(`https://localhost:4000/Kolkata/total_resp/${section}/?sdate=${this.state.sdate}&edate=${this.state.edate}`,"ifm4");
};

handleEdateChange = date => {
  var edates = moment(date).format('YYYY-MM-DD');
this.setState({ 
  edate: edates,
});
console.log(this.state);
this.getContent(`https://localhost:4000/Kolkata/total_resp/${this.state.sec}/?sdate=${this.state.sdate}&edate=${edates}`,"ifm4");
};
 
handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  
  
  getContent(url1, idChart) {
    console.log('URL: '+url1)
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
  componentDidMount(){
    this.getContent(`https://localhost:4000/Kolkata/guage/minExp/?date=${this.state.date}`,"ifm1");
    this.getContent(`https://localhost:4000/Kolkata/guage/maxExp/?date=${this.state.date}`,"ifm2");
    this.getContent(`https://localhost:4000/Kolkata/devExp/?date=${this.state.date}`,"ifm3");
    this.getContent(`https://localhost:4000/Kolkata/total_resp/${this.state.sec}/?sdate=${this.state.sdate}&edate=${this.state.edate}`,"ifm4");
    
  };

 
    render(){
    return (
      <div>
        <div>
          <Container style={{ paddingtop: "50px" }}>
            <Grid  container spacing={3}                                                           
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
          <Container style={{ paddingtop: "50px" }} display="flex" position="relative">
            <iframe
              id="ifm1"
              title="top exp guage"
              width="30%"
              height="350"
              frameBorder="0"
            ></iframe>
            <iframe
              id="ifm2"
              title="least exp guage"
              width="30%"
              height="350"
              frameBorder="0"
            ></iframe>
          </Container>
          <Container>
            <iframe
              id="ifm3"
              title="exp tiil date"
              width="50%"
              height="500"
              frameBorder="0"
            ></iframe>
            <iframe
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
