import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
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

  private margin: any = { top: 20, right: 30, bottom: 30, left: 30};
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

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'lines')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

      // define X & Y domains
      const xDomain = this.data.map(d => d['time']),
            yDomain = [0, d3.max(this.data, d => d['temperature'])];

      // TODO: Why use scaleBand() and not scaleTime()
      const x = d3.scaleBand().domain(xDomain).range([0, this.width]),
            y = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

      const line = d3.line()
            .x((d) => x(d['time']))
            .y((d) => y(d['temperature']));

      // Add the X Axis
      svg.append("g")
          .attr("transform", `translate(0, ${this.height})`)
          .call(d3.axisBottom(x));

          console.log(this.data)

      // Add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y));

      // Add the Line path.
      svg.append("path")
          .data([this.data])
          .attr("d", line);

      /////
      var g = svg.append("g")
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

      var focus = g.append("g")
              .attr("class", "focus")
              .style("display", "none");

          focus.append("line")
              .attr("class", "x-hover-line hover-line")
              .attr("y1", 0)
              .attr("y2", this.height);

          focus.append("line")
              .attr("class", "y-hover-line hover-line")
              .attr("x1", this.width)
              .attr("x2", this.width);

          focus.append("circle")
              .attr("r", 7.5);

          focus.append("text")
              .attr("x", 15)
            	.attr("dy", ".31em");


          // Define the div for the tooltip
          var div = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

          svg.selectAll(".dot")
            .data(this.data.filter(function(d) { return d; }))
            .enter().append("circle")
              .attr("class", "dot")
              .attr("cx", (d) => x(d['time']))
              .attr("cy", (d) => y(d['temperature']))
              .attr("r", 4.5)
              .on("mouseover", mouseover)
              .on("mouseout", mouseout);

          function mouseover(d) {
            div.transition()
               .duration(200)
               .style("opacity", .9);
            div.html(`<span>${d.time}</span> ${d.temperature}&deg`)
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
            };

            function mouseout() {
              div.transition()
                 .duration(250)
                 .style("opacity", 0);
            }

          // svg.append("rect")
          //     .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
          //     .attr("class", "overlay")
          //     .attr("width", this.width)
          //     .attr("height", this.height)
          //     .on("mouseover", function() { focus.style("display", null); })
          //     .on("mouseout", function() { focus.style("display", "none"); })
          //     .on("mousemove", mousemove);
          //
          // function mousemove() {
          //   // console.log(d3.mouse(this)[0])
          //   // console.log(d3.scaleLinear().invert(d3.mouse(this)[0]))
          //   const x0 = d3.mouse(this)[0],
          //       i = bisectDate(this.data, x0, 1),
          //       d0 = this.data[i - 1],
          //       d1 = this.data[i],
          //       d = x0 - d0.year > d1.year - x0 ? d1 : d0;
          //   focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
          //   focus.select("text").text(function() { return d.value; });
          //   focus.select(".x-hover-line").attr("y2", this.height - y(d.value));
          //   focus.select(".y-hover-line").attr("x2", this.width + this.width);
          // }
  }

  createChart() {
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

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // define X & Y domains
    const xDomain = this.data.map(d => d[0]);
    const yDomain = [0, d3.max(this.data, d => d[1])];

    // create scales
    this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

    // bar colors
    this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);

    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));
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
