// Function to load the data from the cleaned_data.csv file
function loadDataAndGenerateChart() {
  // Load the data from the cleaned_data.csv file
  d3.csv("/static/cleaned_data.csv")
    .then(function(data) {
      // Extract the available insurance companies from the data
      var insuranceCompanies = Array.from(new Set(data.map(function(d) { return d.Company; })));

      // Sort the insurance companies alphabetically
      insuranceCompanies.sort();

      // Populate the dropdown menu with the available insurance companies
      var select = d3.select("#companySelect");
      insuranceCompanies.forEach(function(company) {
        select.append("option")
          .attr("value", company)
          .text(company);
      });

      // Function to update the bar chart based on the selected insurance company
      function updateBarChart(selectedCompany) {
        // Filter the data based on the selected insurance company
        var filteredData = data.filter(function(d) {
          return d.Company === selectedCompany;
        });

        // Calculate the average recovery for each coverage within the selected company
        var coverageAverages = {};
        var coverageCounts = {};
        filteredData.forEach(function(d) {
          var coverage = d.Coverage;
          var recovery = parseFloat(d.Recovery);
          if (!isNaN(recovery)) {
            if (coverage in coverageAverages) {
              coverageAverages[coverage] += recovery;
              coverageCounts[coverage]++;
            } else {
              coverageAverages[coverage] = recovery;
              coverageCounts[coverage] = 1;
            }
          }
        });

        // Calculate the average recovery for each coverage and store in coverageData
        var coverageData = Object.keys(coverageAverages).map(function(coverage) {
          return {
            coverage: coverage,
            averageRecovery: coverageAverages[coverage] / coverageCounts[coverage]
          };
        });

        // Sort the coverage data alphabetically
        coverageData.sort(function(a, b) {
          return a.coverage.localeCompare(b.coverage);
        });

        // Set up the dimensions of the visualization
        var margin = { top: 50, right: 20, bottom: 170, left: 150 };
        var width = 800 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        // Clear the previous visualization
        d3.select("#visualization").selectAll("svg").remove();

        // Create the SVG container
        var svg = d3.select("#visualization")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Create scales for x and y axes
        var xScale = d3.scaleBand()
          .domain(coverageData.map(function(d) { return d.coverage; }))
          .range([0, width])
          .padding(0.1);

        var yScale = d3.scaleLinear()
          .domain([0, d3.max(coverageData, function(d) { return d.averageRecovery; })])
          .range([height, 0]);

        // Create and append x and y axes
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .attr("text-anchor", "end");

        svg.append("g")
          .call(d3.axisLeft(yScale));

        // Create bars for each coverage
        svg.selectAll(".bar")
          .data(coverageData)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return xScale(d.coverage); })
          .attr("y", function(d) { return yScale(d.averageRecovery); })
          .attr("width", xScale.bandwidth())
          .attr("height", function(d) { return height - yScale(d.averageRecovery); })
          .attr("fill", "steelblue");

        // Add labels showing the average recovery value at the top of each bar
        svg.selectAll(".label")
          .data(coverageData)
          .enter().append("text")
          .attr("class", "label")
          .attr("x", function(d) { return xScale(d.coverage) + xScale.bandwidth() / 2; })
          .attr("y", function(d) { return yScale(d.averageRecovery) - 5; })
          .attr("dy", "-0.5em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d3.format(".2f")(d.averageRecovery); });

        // Add x-axis label
        svg.append("text")
          .attr("x", width / 2)
          .attr("y", height + margin.bottom - 10)
          .attr("text-anchor", "middle")
          .text("Coverage");

        // Add y-axis label
        svg.append("text")
          .attr("x", -height / 2)
          .attr("y", -margin.left + 14)
          .attr("transform", "rotate(-90)")
          .attr("text-anchor", "middle")
          .text("Average Recovery Amount");
      }

      // Call the updateBarChart function with the default selected insurance company
      updateBarChart(insuranceCompanies[0]);

      // Add an event listener to the dropdown menu
      select.on("change", function() {
        var selectedCompany = d3.select(this).property("value");
        updateBarChart(selectedCompany);
      });

    })
    .catch(function(error) {
      console.log(error);
    });
}

// Call the function to load data and generate the initial chart
loadDataAndGenerateChart();
