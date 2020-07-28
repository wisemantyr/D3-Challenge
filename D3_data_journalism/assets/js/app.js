var chosenX = "obesity"; //initial x variable for chart
var chosenY = "poverty"; //initial y variable for chart

d3.csv("assets/data/data.csv").then(function (censusData) {
    console.log(censusData)
    //transform data types
    censusData.forEach(function (d) {
        d.poverty = +d.poverty //convert data from strings to numbers
        d.obesity = +d.obesity
        d.age = +d.age
        d.smokes = +d.smokes
        d.income = +d.income
        d.healthcare = +d.healthcare
    });
    console.log(censusData) //check that data was read

    var xLinearScale = xScale(censusData, chosenX); //set x linear scale variable to scale of initial x value
    var yLinearScale = yScale(censusData, chosenY); //same for y
    var bottomAxis = d3.axisBottom(xLinearScale); //create bottom axis with x linear scale
    var leftAxis = d3.axisLeft(yLinearScale); //create left axis with y linear scale

    var xAxis = chartGroup.append("g") //append svg area with g tag for axes
        .classed("x-axis", true) //create class for css styling
        .attr("transform", `translate(0, ${chartHeight})`) //move x axis to appropriate place
        .call(bottomAxis); //add to page
    var yAxis = chartGroup.append("g") //same as above for y
        .classed("y-axis", true)
        .call(leftAxis);

    var scatterPoints = chartGroup.append("g").selectAll("circle") //append chart area with g tag for circles and select all circles
        .data(censusData) //attach data to circles
        .enter()
        .append("circle") //create circle for each data point
        .attr("class", "circles")
        .attr("cx", d => xLinearScale(d[chosenX])) //change the cx attribute of circles to initial "chosenX" and scale
        .attr("cy", d => yLinearScale(d[chosenY])) //same for cy
        .attr("r", 12) //size of points
        .attr("fill", "#b3e6b3") //color of points
        .attr("opacity", ".75");

    var circleText = chartGroup.append("g").selectAll("text") //apend chart area with g tag for text in circles and select all text tags
        .data(censusData) //attach data to text tags
        .enter()
        .append("text") //create text for each data point
        .attr("x", d => xLinearScale(d[chosenX])) //change the x attribute of text in circles to initial "chosenX" and scale
        .attr("y", d => yLinearScale(d[chosenY])) //same for y
        .attr("text-anchor", "middle") //anchor text to middle of text
        .attr("alignment-baseline", "middle") //same as above
        .attr("stroke", "black")
        .attr("stroke-width", .5)
        .text(d => d.abbr) //set text to abbreviation from data
        .classed("scatterpoint-text", true) //class for css styling
    
    var labelsGroupX = chartGroup.append("g") //create area for x axis labels
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`); //axis position

    var obesityLabel = labelsGroupX.append("text") //append created area with text tag
        .attr("x", 0) 
        .attr("y", 20) //position of first x axis label
        .attr("value", "obesity") //for event listener
        .classed("active-axis", true) //for styling
        .text("Obesity Rate (%)"); //axis label text

    var smokesLabel = labelsGroupX.append("text") //append created area with text tag
        .attr("x", 0)
        .attr("y", 45) //position of the second x axis label
        .attr("value", "smokes") //for event listener
        .classed("inactive-axis", true) //for styling
        .text("Smoking Rate (%)"); //axis label text

    var healthcareLabel = labelsGroupX.append("text") //repeat of above
        .attr("x", 0)
        .attr("y", 70) //position of the third x axis label
        .attr("value", "healthcare") //for event listener
        .classed("inactive-axis", true) //for styling
        .text("Has Healthcare (%)") //axis label text

    var labelsGroupY = chartGroup.append("g") //create area for y labels
        .attr("transform", "rotate(-90)"); //flip vertically

    var povertyLabel = labelsGroupY.append("text") //append created area with text tag
        .attr("x", -(chartHeight / 2)) //middle of y axis
        .attr("y", -(chartMargin.left/2) + 20) //position of first y axis label
        .attr("value", "poverty") //for event listener
        .classed("active-axis", true) //for styling
        .text("Poverty Rate (%)"); //axis label text

    var ageLabel = labelsGroupY.append("text") //append created area with text tag
        .attr("x", -(chartHeight / 2)) //middle of y axis
        .attr("y", -(chartMargin.left / 2 + 5)) //position of second y axis label
        .attr("value", "age") //for event listener
        .classed("inactive-axis", true) //for styling
        .text("Age"); //axis label text

    var incomeLabel = labelsGroupY.append("text") //append created area with text tag
        .attr("x", -(chartHeight/2)) //middle of y axis
        .attr("y", -(chartMargin.left/2 + 30)) //position of third y axis label
        .attr("value", "income") //for event listener
        .classed("inactive-axis", true) //for styling
        .text("Income") //axis label text

    var circleText = updateToolTip(chosenX, chosenY, circleText); //tool tips for default view

    labelsGroupX.selectAll("text") //create event listener for x labels
        .on("click", function () {
            var value = d3.select(this).attr("value"); //select value attr of label
            if (value !== chosenX) { //if value is different than the current selection
                chosenX = value; //set chosenX to selection value
                console.log(chosenX);

                xLinearScale = xScale(censusData, chosenX); //create new linear scale
                xAxis = renderXAxis(xLinearScale, xAxis); //create new axis
                scatterPoints = renderPointsX(scatterPoints, xLinearScale, chosenX); //create points
                circleText = updateToolTip(chosenX, chosenY, circleText); //update tool tips
                circleText = renderTextX(circleText, xLinearScale, chosenX); //update text inside of circles

                if (chosenX === "smokes") { //set appropriate styling
                    smokesLabel
                        .classed("active-axis", true)
                        .classed("inactive-axis", false);
                    obesityLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false)
                    healthcareLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false)
                }
                else if (chosenX === "healthcare") {
                    smokesLabel
                        .classed("active-axis", false)
                        .classed("inactive-axis", true);
                    obesityLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false)
                    healthcareLabel
                        .classed("inactive-axis", false)
                        .classed("active-axis", true)
                }
                else {
                    smokesLabel
                        .classed("active-axis", false)
                        .classed("inactive-axis", true);
                    obesityLabel
                        .classed("inactive-axis", false)
                        .classed("active-axis", true);
                    healthcareLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false)
                    }
            }
        });

    labelsGroupY.selectAll("text") ////create event listener for y labels
        .on("click", function () {
            var value = d3.select(this).attr("value"); //select value attr of label
            if (value !== chosenY) { //if value is different than the current selection
                chosenY = value; //set chosenX to selection value
                console.log(chosenY);
                yLinearScale = yScale(censusData, chosenY); //create new scale
                yAxis = renderYAxis(yLinearScale, yAxis); //create axis
                scatterPoints = renderPointsY(scatterPoints, yLinearScale, chosenY); //update circles
                circleText = updateToolTip(chosenX, chosenY, circleText); //update tool tips
                circleText = renderTextY(circleText, yLinearScale, chosenY) //update text in circles

                if (chosenY === "age") { //set appropriate styling
                    ageLabel
                        .classed("active-axis", true)
                        .classed("inactive-axis", false);
                    povertyLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false);
                    incomeLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false);
                }
                else if (chosenY === "income") {
                    ageLabel
                        .classed("active-axis", false)
                        .classed("inactive-axis", true);
                    povertyLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false);
                    incomeLabel
                        .classed("inactive-axis", false)
                        .classed("active-axis", true);
                }
                else {
                    ageLabel
                        .classed("active-axis", false)
                        .classed("inactive-axis", true);
                    povertyLabel
                        .classed("inactive-axis", false)
                        .classed("active-axis", true);
                    incomeLabel
                        .classed("inactive-axis", true)
                        .classed("active-axis", false);

                }
            }
        });
});