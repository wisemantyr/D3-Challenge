var svgWidth = 800; //width of svg tag area
var svgHeight = 500; //height of svg tag area

var chartMargin = { // Define the chart's margins as an object
    top: 30,
    right: 30,
    bottom: 100,
    left: 140
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right; //set chart width to width of svg minus left and right margins
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom; //set chart height to height of svg minus top and bottom margins

var svg = d3.select("#scatter") //select id tag in index
    .append("svg") //append tag with svg tag
    .attr("height", svgHeight) //set dimensions
    .attr("width", svgWidth);

var chartGroup = svg.append("g") //append svg with g tag for the entire chart area
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

function xScale(censusData, chosenX) { //function to scale x-axis data
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenX]) * .9, d3.max(censusData, d => d[chosenX]) * 1.1]) //extend range of data to move points off axes
        .range([0, chartWidth]); //place between 0 pixels of chart area left side and width of chart area 
    return xLinearScale;
}
function yScale(censusData, chosenY) { //same as above for y-axis data
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenY]) * .9, d3.max(censusData, d => d[chosenY]) * 1.1])
        .range([chartHeight, 0]); //place between the bottom of the chart and the top of the chart
    return yLinearScale;
}

function renderXAxis(newXScale, xAxis) { //function to create X axis
    var bottomAxis = d3.axisBottom(newXScale); //scale x axis according to chosen value
    xAxis.transition() //create appearance of slow transition
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}
function renderYAxis(newYScale, yAxis) { //same as above for y axis
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}
function renderPointsX(scatterPoints, newXScale, chosenX) { //build points on scatter plot based on chosen value and scale accordingly
    scatterPoints.transition() //create appearance of slow transition
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenX])); //change the cx attribute of circles to chosen data and scale
    return scatterPoints;
}
function renderPointsY(scatterPoints, newYScale, chosenY) { //build points on scatter plot based on chosen value and scale accordingly
    scatterPoints.transition() //create appearance of slow transition
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenY])); //change the cy attribute of circles to chosen data and scale
    return scatterPoints;
}

function renderTextX(circleText, newXScale, chosenX) { //change abbreviated state labels inside of circles based on event listeners
    circleText.transition() //create appearance of slow transition
        .duration(1000)
        .attr("x", d => newXScale(d[chosenX])); //change the x attribute according to chosen data and scale
    return circleText;
}
function renderTextY(circleText, newYScale, chosenY) { //same as above for y attr
    circleText.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenY]));
    return circleText;
}

//change the tool tips to the correct data
function updateToolTip(chosenX, chosenY, circleText) {
    var xLabel; //initiate empty variable to hold tooltip values
    var yLabel;

    if (chosenX === "obesity") { //value for event listener
        xLabel = "Obesity"; //text inside of tooltip
        plotTitle1 = "Obesity Rate vs." //left side of plot title text
    }
    else if (chosenX === "healthcare") {
        xLabel = "Has Healthcare";
        plotTitle1 = "Healthcare Coverage vs.";
    }
    else {
        xLabel = "Smokes"
        plotTitle1 = "Smoking Rate vs."
    }

    if (chosenY === "poverty") {
        yLabel = "Poverty (%)";
        plotTitle2 = "Poverty Rate";
    }
    else if (chosenY === "income") {
        yLabel = "Income";
        plotTitle2 = "Income";
    }
    else {
        yLabel = "Age";
        plotTitle2 = "Median Age"
    }

    d3.selectAll(".plotTitle") //select element in index
        .html(`${plotTitle1} ${plotTitle2}`); //set html to title depending on above scenarios

    var tooltip = d3.select("#scatter").append("div")
        .attr("class", "tooltip")
        .style("visibility", "hidden");
    circleText.on("mouseover", function(d) {
        var tipHtml = `${d.state} <br> ${xLabel}: ${d[chosenX]}% <br> ${yLabel}: ${d[chosenY]}`;
        tooltip
            .html(tipHtml)
            .style("visibility", "visible")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px")
            .transition()
            .duration(200) // ms
            .style("opacity", .9)
    });
    circleText.on("mouseout", function(d){
        tooltip
            .style("opacity", 0)
            .transition()
            .duration(300) // ms
    });
};