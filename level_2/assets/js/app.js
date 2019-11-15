// @TODO: YOUR CODE HERE!

(async function(){
    // Initial Params
    const svgWidth = 960,
          svgHeight = 500;

    // Define the chart's margins as an object
    const margin = {top: 20, right: 60, bottom: 100, left: 100};

    // Define dimensions of the chart area
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    // define the x_axis and y_axis
    let chosenXAxis = 'poverty';
    let chosenYAxis = 'healthcare';

    // collect data
    const init_data = await d3.csv("./assets/data/data.csv");


    // initial the data to number
    init_data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes =+ data.smokes
    });

    // get the overall space for figures
    const svg = d3.select("#scatter")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

    // Append a group area, then set its margins
    const chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // xScale for changing data
    function xScale(init_data, chosenXAxis) {
        // create scales
        let xLinearScale = d3.scaleLinear()
          .domain([d3.min(init_data, d => d[chosenXAxis]) * 0.8,
            d3.max(init_data, d => d[chosenXAxis]) * 1.2
          ])
          .range([0, chartWidth]);
      
        return xLinearScale;
      }
    // d3.extent returns the an array containing the min and max values for the property specified
    let xLinearScale = xScale(init_data, chosenXAxis);
    // yScale for changing data
    function yScale(init_data, chosenYAxis) {
        // create scales
        let yLinearScale = d3.scaleLinear()
          .domain([d3.min(init_data, d => d[chosenYAxis]) * 0.8,
            d3.max(init_data, d => d[chosenYAxis]) * 1.2
          ])
          .range([chartHeight, 0]);
      
        return yLinearScale;
      }
    // Configure a linear scale with a range between the chartHeight and 0
    let yLinearScale = yScale(init_data, chosenYAxis);
    
    // These will be used to create the chart's axes   
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);
    
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);


    let yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // initial the circles group to show data at beginning
    let circlesGroup = chartGroup.selectAll("circle")
                                    .data(init_data)
                                    .enter()
                                    .append("circle")
                                    .attr("cx", d => xLinearScale(d[chosenXAxis]))
                                    .attr("cy", d => yLinearScale(d[chosenYAxis]))
                                    .attr("r", "12")
                                    .attr("fill", "skyblue")
                                    .attr("opacity", ".5");

    // get the textgroup for state initial
    let textGroup = chartGroup.selectAll(".my-text")
                .data(init_data)
                .enter()
                .append("text")
                .attr("x", d => xLinearScale(d[chosenXAxis]))
                .attr("y", d => yLinearScale(d[chosenYAxis] - 0.2))
                .attr("text-anchor", "middle")
                .attr("class","stateText")
                .style("fill", "white")
                .style("font", "10px sans-serif")
                .style("font-weight", "bold")
                .text(function(data) {return data.abbr;})


    // X labeled
    const labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
            
            
    const poverty_label = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In poverty (%)");
    
    const age_label = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

    const income_label = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income (Median)");


    // y labeled      
    const ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");
                  
    const healthcare_label = ylabelsGroup.append("text")
            .attr("x", -170)
            .attr("y", -30)
            .attr("value", "healthcare") // value to grab for event listener
            .classed("active", true)
            .text("Lacks Healthcare (%)");
    
    const smokes_label = ylabelsGroup.append("text")
            .attr("x", -170)
            .attr("y", -50)
            .attr("value", "smokes") // value to grab for event listener
            .classed("inactive", true)
            .text("Smokes (%)");

    const obesity_label = ylabelsGroup.append("text")
            .attr("x", -170)
            .attr("y", -70)
            .attr("value", "obesity") // value to grab for event listener
            .classed("inactive", true)
            .text("Obses (%)");

    

    // Initialize tool tip
    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`);
        });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // function of circles
    function renderCircles(circlesGroup, newXScale, chosenXaxis, chosenYaxis, newYScale) {

        circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXaxis]))
        .attr('cy', d => newYScale(d[chosenYaxis]));
            
        return circlesGroup;
    }



    // x render
    function xrenderAxes(newXScale, xAxis) {
        const bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
    
        return xAxis;
        }
    
    // y render
    function yrenderAxes(newXScale, yAxis) {
        const leftAxis = d3.axisLeft(newXScale);
    
        yAxis.transition()
            .duration(1000)
            .call(leftAxis);
        
        return yAxis;
        }

    
    // click on the x axis
    labelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
            textGroup.remove()
            // replaces chosenXAxis with value
            chosenXAxis = value;

            xLinearScale = xScale(init_data, chosenXAxis);
            // function used for updating xAxis const upon click on axis label

            // updates x axis with transition
            xAxis = xrenderAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, chosenYAxis, yLinearScale);

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                poverty_label
                    .classed("active", true)
                    .classed("inactive", false);
                age_label
                    .classed("active", false)
                    .classed("inactive", true);
                income_label
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === 'age'){
                poverty_label
                    .classed("active", false)
                    .classed("inactive", true);
                age_label
                    .classed("active", true)
                    .classed("inactive", false);
                income_label
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                poverty_label
                    .classed("active", false)
                    .classed("inactive", true);
                age_label
                    .classed("active", false)
                    .classed("inactive", true);
                income_label
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
        textGroup = chartGroup.selectAll(".my-text")
        .data(init_data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis] - 0.2))
        .attr("text-anchor", "middle")
        .attr("class","stateText")
        .style("fill", "white")
        .style("font", "10px sans-serif")
        .style("font-weight", "bold")
        .text(function(data) {return data.abbr;})
    });

    ylabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = value;

            yLinearScale = yScale(init_data, chosenYAxis);
            // function used for updating xAxis const upon click on axis label

            // updates x axis with transition
            yAxis = yrenderAxes(yLinearScale, yAxis);
            // function used for updating circles group with a transition to
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, chosenYAxis, yLinearScale);

            textGroup.remove()
            // changes classes to change bold text
            if (chosenYAxis === "healthcare") {
                healthcare_label
                    .classed("active", true)
                    .classed("inactive", false);
                smokes_label
                    .classed("active", false)
                    .classed("inactive", true);
                obesity_label
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === 'smokes'){
                healthcare_label
                    .classed("active", false)
                    .classed("inactive", true);
                smokes_label
                    .classed("active", true)
                    .classed("inactive", false);
                obesity_label
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                healthcare_label
                    .classed("active", false)
                    .classed("inactive", true);
                smokes_label
                    .classed("active", false)
                    .classed("inactive", true);
                obesity_label
                    .classed("active", true)
                    .classed("inactive", false);
            }
            textGroup = chartGroup.selectAll(".my-text")
                .data(init_data)
                .enter()
                .append("text")
                .attr("x", d => xLinearScale(d[chosenXAxis]))
                .attr("y", d => yLinearScale(d[chosenYAxis] - 0.2))
                .attr("text-anchor", "middle")
                .attr("class","stateText")
                .style("fill", "white")
                .style("font", "10px sans-serif")
                .style("font-weight", "bold")
                .text(function(data) {return data.abbr;})
        }
    });

})()
