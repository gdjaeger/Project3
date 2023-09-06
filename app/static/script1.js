// Fetch the CSV data from the server
d3.csv("/static/cleaned_data.csv")
  .then(function (data) {
    // Check if data is an array before using forEach
    if (Array.isArray(data)) {
      // Count the occurrences of each disposition
      var dispositionCounts = {};
      data.forEach(function (d) {
        var disposition = d.Disposition;
        if (disposition in dispositionCounts) {
          dispositionCounts[disposition]++;
        } else {
          dispositionCounts[disposition] = 1;
        }
      });

      // Set up the dimensions of the visualization
      var margin = { top: 20, right: 20, bottom: 250, left: 70 }; // Increased bottom margin
      var width = 800 - margin.left - margin.right;
      var height = 400 - margin.top - margin.bottom;

      // Create the SVG container
      var svg = d3.select("#visualization")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Create scales for x and y axes
      var xScale = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
      var yScale = d3.scaleLinear().range([height, 0]);

      // Set the domain of the scales
      xScale.domain(data.map(function (d) { return d.Disposition; }));
      yScale.domain([0, d3.max(Object.values(dispositionCounts))]);

      // Create and append x and y axes
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.8em") // Adjust x position
        .attr("dy", "0.15em") // Adjust y position
        .style("font-size", "10px"); // Adjust font size
      svg.append("g")
        .call(d3.axisLeft(yScale));

      // Create bars for each disposition
      svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", function (d) { return xScale(d.Disposition); })
        .attr("y", function (d) { return yScale(dispositionCounts[d.Disposition]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(dispositionCounts[d.Disposition]); })
        .attr("fill", "steelblue")
        .on("mouseover", function (event, d) {
          // Show count on mouseover
          var tooltip = d3.select("#tooltip")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 25) + "px");
          tooltip.html("Count: " + dispositionCounts[d.Disposition])
            .style("visibility", "visible");
        })
        .on("mouseout", function () {
          // Hide tooltip on mouseout
          d3.select("#tooltip").style("visibility", "hidden");
        });

      // Create tooltip element
      d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px 10px")
        .style("visibility", "hidden");
    } else {
      // Handle the case where data is not an array (e.g., it may be empty or not loaded correctly)
      console.error('Data is not an array:', data);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
