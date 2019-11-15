// @TODO: YOUR CODE HERE!
(async function(){
    const init_data = await d3.csv("./assets/data/data.csv");
    init_data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });
    console.log(init_data);

    const
        svgWidth = 960,
        svgHeight = 500;

    // Define the chart's margins as an object
    const margin = {top: 20, right: 60, bottom: 60, left: 50};

    // Define dimensions of the chart area
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#scatter")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

    // Append a group area, then set its margins
    const chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Configure a time scale
    // d3.extent returns the an array containing the min and max values for the property specified
    const xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(init_data, data => data.poverty)])
        .range([0, chartWidth]);

    // Configure a linear scale with a range between the chartHeight and 0
    const yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(init_data, data => data.healthcare)])
        .range([chartHeight, 0]);
    
    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes   
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    const circlesGroup = chartGroup.selectAll("circle")
                                    .data(init_data)
                                    .enter()
                                    .append("circle")
                                    .attr("cx", d => xLinearScale(d.poverty))
                                    .attr("cy", d => yLinearScale(d.healthcare))
                                    .attr("r", "12")
                                    .attr("fill", "skyblue")
                                    .attr("opacity", ".5")
       
                                    
    chartGroup.selectAll(".my-text")
                .data(init_data)
                .enter()
                .append("text")
                .attr("text-anchor", "middle")
                .attr("class","stateText")
                .style("fill", "white")
                .style("font", "10px sans-serif")
                .style("font-weight", "bold")
                .text(function(data) {return data.abbr;})
                .attr("x", d => xLinearScale(d.poverty))
                .attr("y", d => yLinearScale(d.healthcare - 0.2));

    
    // Initialize tool tip
    const toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>healthcare: ${d.healthcare}<br>poverty: ${d.poverty}`);
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

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 4)
    .attr("x", 0 - (chartHeight / 2 + 50))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2 - 80}, ${chartHeight + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

})()

