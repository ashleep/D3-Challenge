
var svgWidth = 850;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 60,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  

d3.csv("data.csv").then(function(censusData) {
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //create axis scales
    var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.poverty)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.healthcare)])
    .range([height, 0]);

    //create axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axis to svg
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);


    //append the cirle markers
    chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "13")
    .attr("fill", "#0585B0")
    .attr("stroke", "#ADD8E6")
    .attr("opacity","0.8");

    //append the abbreviations
    censusData.forEach(Object=>{

        chartGroup.append("text")
        .attr("x", xLinearScale(Object.poverty))
        .attr("y", yLinearScale(Object.healthcare)-0)
        .attr("class", "circleText")
        .attr("dy", "0.3em")
        .attr("fill","#ADD8E6")
        .attr("text-anchor","middle")
        .text(Object.abbr);
        


    });


    //append each axis label
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Healthcare (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .attr("class", "axisText")
    .text("In Poverty(%)");


}).catch(function(error) {
    console.log(error);
});