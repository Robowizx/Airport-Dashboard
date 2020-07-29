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
                        size: '70%',
                        background: '#fff',
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
                        background: '#fff',
                        strokeWidth: '67%',
                        margin: 0, // margin is in pixels
                        dropShadow: {
                          enabled: true,
                          top: -3,
                          left: 0,
                          blur: 4,
                          opacity: 0.35
                        }
                      },
                  
                      dataLabels: {
                        show: true,
                        name: {
                          offsetY: 0,
                          show: true,
                          color: '#888',
                          fontSize: '10px'
                        },
                        value: {
                          formatter: function(val) {
                            return parseInt(val);
                          },
                          color: '#111',
                          fontSize: '14px',
                          show: true,
                          offsetY: -1,
                        }
                      }
                    }
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shade: 'dark',
                      type: 'horizontal',
                      shadeIntensity: 0.5,
                      gradientToColors: ['#ABE5A1'],
                      inverseColors: true,
                      opacityFrom: 1,
                      opacityTo: 1,
                      stops: [0, 100]
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
                    height="70%"
                    width="70%"
                />
            </div>
        )
    }
}

export default GaugeChart;