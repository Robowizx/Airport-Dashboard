import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import '../../App.css';

class GaugeChart extends Component {
    constructor(props){
        super(props);
        this.state={
            options:{
                chart: {
                    type: 'radialBar',
                    toolbar: {
                      show: false
                    }
                  },
                  plotOptions: {
                    radialBar: {
                      startAngle: -135,
                      endAngle: 225,
                       hollow: {
                        margin: 0,
                        size: '65%',
                        background: '#424242',
                        image: undefined,
                        imageOffsetX: 0,
                        imageOffsetY: 0,
                        position: 'front',
                        dropShadow: {
                          enabled: true,
                          top: 3,
                          left: 0,
                          blur: 4,
                          opacity: 0.24
                        }
                      },
                      track: {
                        background: '#424242',
                        strokeWidth: '90%',
                        margin: 0, // margin is in pixels

                      },
                  
                      dataLabels: {
                        show: true,
                        name: {
                          offsetY: 0,
                          show: true,
                          color: '#fff',
                          fontSize: '10px'
                        },
                        value: {
                          formatter: function(val) {
                            return parseInt(val);
                          },
                          color: '#fff',
                          fontSize: '11px',
                          show: true,
                          offsetY: -1,
                        }
                      }
                    }
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      type: 'horizontal',
                      shadeIntensity: 1,
                      opacityFrom: 1,
                      opacityTo: 1,
                      colorStops: [
                      {
                        offset: 0,
                        color: props.chartType === "best" ? "#00FFFF" : "#FF2F2F",
                        opacity: 1
                      },
                      {
                        offset: 100,
                        color: props.chartType === "best" ? "#00FF00" : "#FFA500",
                        opacity: 1
                      }],
                    }
                  },
                  stroke: {
                    lineCap: 'round'
                  },
                  labels: ['Exp'],
                  },
            series: [this.props.exp]
        }
    }
    render() {
        return (
            <div id="chart">
                <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type="radialBar"
                    height="60%"
                    width="60%"
                />
            </div>
        )
    }
}

export default GaugeChart;