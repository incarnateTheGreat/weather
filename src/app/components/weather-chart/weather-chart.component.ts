import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import * as d3 from 'd3';

@Component({
  selector: 'app-weather-chart',
  templateUrl: './weather-chart.component.html',
  styleUrls: ['./weather-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WeatherChartComponent implements OnInit, OnChanges {
  @ViewChild('weatherChart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;

  private margin: any = { top: 20, right: 120, bottom: 30, left: 30};
  private chart: any;
  private svg: any;
  private width: number;
  private height: number;
  private line: any;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private updateDuration: number = 1000;
  private hoverDuration: number = 250;
  private isDataInit: boolean = false;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.data) {
      if (this.isDataInit) {
        this.updateChart();
      } else if (!this.isDataInit) {
        this.createLineChart();
      }
    }
  }

  getD3Data() {
    // Find and Assign the Min and Max Y-Axis range.
    const yMin = d3.min(this.data, d => Math.min(d['temperature'])),
          yMax = d3.max(this.data, d => Math.max(d['temperature'])),
          yDomain = [yMin - 1, yMax + 1];

    // In order to achieve the X-Axis Ticks to start at 0,0, scale using scaleTime() and
    // update the Data using UNIX Timestamps to a Moment Object.
    this.data.forEach((d) => {
      d['time'] = moment.unix(d['time']).startOf('day');
    });

    // Find and Assign the Min and Max X-Axis range.
    const xMin = d3.min(this.data, d => Math.min(d['time'])),
          xMax = d3.max(this.data, d => Math.max(d['time'])),
          xDomain = [xMin, xMax];

    // Define the X & Y Scales.
    this.xScale = d3.scaleTime().domain(xDomain).range([0, this.width]),
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

    // Draw the Line.
    this.line = d3.line()
        .x((d) => this.xScale(d['time']))
        .y((d) => this.yScale(d['temperature']));
  }

  createLineChart() {
    this.isDataInit = true;

    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    const chartElem = d3.select(element),
          aspect = this.width / this.height;

    this.svg = chartElem.append("div")
      .classed("svg-container", true)
      .append('svg')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${element.offsetWidth} ${element.offsetHeight}`)
      .classed("svg-content-responsive", true);

    // Chart out the Plot Area.
    this.chart = this.svg
      .append('g')
      .attr('class', 'lines')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Use the Weather Data to create the SVG points and Line.
    this.getD3Data();

    // Add the X Axis
    this.svg
        .append("g")
        .attr("transform", `translate(50, ${this.height})`)
        .attr('class', 'x-axis')
        .call(d3.axisBottom(this.xScale).ticks(d3.timeDay));

    // Add the Y Axis
    this.svg
        .append("g")
        .attr('transform', `translate(50, 0)`)
        .attr('class', 'y-axis')
        .call(d3.axisLeft(this.yScale));

    // Add the Line path.
    this.svg
        .append("path")
        .attr("class", "weather-line")
        .attr('transform', `translate(50, 0)`)
        .data([this.data])
        .attr("d", this.line);

    // Add titles to the X-Axis.
    this.svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${this.width / 2}, ${this.height + 50})`)
        .text("Date");

    // Add titles to the Y-Axis.
    this.svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(5, ${this.height / 2})rotate(-90)`)
        .html("Temperature (&deg C)");

    // Define the div for the tooltip
    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Draw the Dots on the Chart.
    this.svg
      .selectAll(".dot")
      .data(this.data.filter(d => d))
      .enter()
        .append("circle")
        .attr('transform', `translate(50, 0)`)
        .attr("class", "dot")
        .attr("cx", (d) => this.xScale(d['time']))
        .attr("cy", (d) => this.yScale(d['temperature']))
        .attr("r", 4.5)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    // Hover functionality.
    function mouseover(d) {
      div.transition()
         .duration(this.hoverDuration)
         .style("opacity", .9);
      div.html(`<span>${d['time'].format('ddd MMM DD')}</span> ${d['temperature']}&deg`)
         .style("left", `${d3.event.pageX - 75}px`)
         .style("top", `${d3.event.pageY + 10}px`);
      };

    function mouseout() {
      div.transition()
         .duration(this.hoverDuration)
         .style("opacity", 0);
    }
  }

  updateChart() {
    this.getD3Data();

    // Update the Y-Axis.
    this.svg
        .select('.y-axis')
        .transition()
        .duration(this.updateDuration)
        .call(d3.axisLeft(this.yScale));

    // Update the Line.
    this.svg
        .select("path.weather-line")
        .data([this.data])
        .transition()
        .duration(this.updateDuration)
        .attr('transform', `translate(50, 0)`)
        .attr("d", this.line);

    // Update the Points on the Chart.
    this.svg
        .selectAll('circle')
        .data(this.data)
        .transition()
        .duration(this.updateDuration)
        .attr('transform', `translate(50, 0)`)
        .attr("cx", (d) => this.xScale(d['time']))
        .attr("cy", (d) => this.yScale(d['temperature']))
        .attr("r", 4.5);
  }
}
