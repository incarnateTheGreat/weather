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
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    // this.createLineChart();

    // if (this.data) this.updateChart();
  }

  ngOnChanges() {
    if (this.data) this.createLineChart();
  }

  createLineChart() {
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    const chartElem = d3.select(element),
          aspect = this.width / this.height;

    const svg = chartElem.append("div")
      .classed("svg-container", true)
      .append('svg')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${element.offsetWidth} ${element.offsetHeight}`)
      .classed("svg-content-responsive", true);

    // Chart out the Plot Area.
    this.chart = svg.append('g')
      .attr('class', 'lines')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

      // Define the X & Y domains
      const xDomain = this.data.map(d => d['time']),
            yDomain = [0, d3.max(this.data, d => d['temperature'])];

      // In order to achieve the X-Axis Ticks to start at 0,0, scale using scaleTime() and
      // update the Data using UNIX Timestamps to a Moment Object.
      this.data.forEach((d) => {
        d.time = moment.unix(d.time).startOf('day');
      });

      // Find and Assign the Min and Max X-Axis range.
      var xMin = d3.min(this.data, d => Math.min(d.time));
      var xMax = d3.max(this.data, d => Math.max(d.time));

      // Define the X & Y Scales.
      const x = d3.scaleTime().domain([xMin, xMax]).range([0, this.width]),
            y = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

      // Draw the Line and apply the X & Y Scales to it.
      const line = d3.line()
            .x((d) => x(d['time']))
            .y((d) => y(d['temperature']));

      // Add the X Axis
      svg.append("g")
          .attr("transform", `translate(50, ${this.height})`)
          .attr('class', 'x-axis')
          .call(d3.axisBottom(x).ticks(d3.timeDay));

      // Add the Y Axis
      svg.append("g")
          .attr('transform', `translate(50, 0)`)
          .attr('class', 'y-axis')
          .call(d3.axisLeft(y));

      // Add the Line path.
      svg.append("path")
          .attr("class", "weather-line")
          .attr('transform', `translate(50, 0)`)
          .data([this.data])
          .attr("d", line);

      // Add titles to The Axis'.
       svg.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", `translate(5, ${this.height / 2})rotate(-90)`)
          .html("Temperature (&deg C)");

       svg.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", `translate(${this.width / 2}, ${this.height + 50})`)
          .text("Date");

      // Define the div for the tooltip
      const div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      // Draw the Dots on the Chart.
      svg.selectAll(".dot")
        .data(this.data.filter(d => d))
        .enter().append("circle")
          .attr('transform', `translate(50, 0)`)
          .attr("class", "dot")
          .attr("cx", (d) => x(d['time']))
          .attr("cy", (d) => y(d['temperature']))
          .attr("r", 4.5)
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);

      // Hover functionality.
      function mouseover(d) {
        div.transition()
           .duration(200)
           .style("opacity", .9);
        div.html(`<span>${d.time.format('ddd MMM DD')}</span> ${d.temperature}&deg`)
           .style("left", `${d3.event.pageX - 75}px`)
           .style("top", `${d3.event.pageY + 10}px`);
        };

      function mouseout() {
        div.transition()
           .duration(250)
           .style("opacity", 0);
      }
  }

  updateChart() {
    // update scales & axis
    this.xScale.domain(this.data.map(d => d[0]));
    this.yScale.domain([0, d3.max(this.data, d => d[1])]);
    this.colors.domain([0, this.data.length]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    const update = this.chart.selectAll('.bar')
      .data(this.data);

    // remove exiting bars
    update.exit().remove();

    // update existing bars
    this.chart.selectAll('.bar').transition()
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.height - this.yScale(d[1]))
      .style('fill', (d, i) => this.colors(i));

    // add new bars
    update
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0)
      .style('fill', (d, i) => this.colors(i))
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d[1]))
      .attr('height', d => this.height - this.yScale(d[1]));
  }
}
