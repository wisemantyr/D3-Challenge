// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
top: 30,
right: 30,
bottom: 30,
left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

var chartGroup = svg.append("g")
.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


d3.csv("assets/data/data.csv").then(function (ogData) {
console.log(ogData)
ogData.forEach(function (d) {
    d.poverty = +d.poverty
    d.povertyMoe = +d.povertyMoe
    d.age = +d.age
    d.ageMoe = +d.ageMoe
    d.income = +d.income
    d.incomeMoe = +d.incomeMoe
    d.healthcare = +d.healthcare
    d.healthcareLow = +d.healthcareLow
    d.healthcareHigh = +d.healthcareHigh
    d.obesity = +d.obesity
    d.obesityLow = +d.obesityLow
    d.obesityHigh = +d.obesityHigh
    d.smokes = +d.smokes
    d.smokesLow = +d.smokesLow
    d.smokesHigh = +d.smokesHigh
});
console.log(ogData)

var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(ogData, d => d.poverty))
    .range([0, chartWidth]);

// Configure a linear scale with a range between the chartHeight and 0 and the domain between 0 and the max of the miles walked
var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(ogData, d => d.obesity)])
    .range([0, chartHeight]);

// Create two new functions passing the scales in as arguments
// These will be used to create the chart's axes
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
.call(leftAxis)
.classed("axis", true)

chartGroup.append("g")
.classed("axis", true)
.attr("transform", `translate(0, ${chartHeight})`)
.call(bottomAxis);
})



