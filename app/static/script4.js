// Load the data from the cleaned_data.csv file
d3.csv("/static/cleaned_data.csv").then(function(data) {
    // Convert recovery values to numeric
    data.forEach(function(d) {
        d.Recovery = +d.Recovery;
    });

    // Calculate the average recovery for each company
    var companyAverages = {};
    var companyCounts = {};
    data.forEach(function(d) {
        var company = d.Company;
        var recovery = parseFloat(d.Recovery);
        if (!isNaN(recovery)) {
            if (company in companyAverages) {
                companyAverages[company] += recovery;
                companyCounts[company]++;
            } else {
                companyAverages[company] = recovery;
                companyCounts[company] = 1;
            }
        }
    });

    // Calculate the average recovery for each company and store in companyData
    var companyData = Object.keys(companyAverages).map(function(company) {
        return {
            company: company,
            averageRecovery: companyAverages[company] / companyCounts[company]
        };
    });

    // Sort the company data in descending order of average recovery
    companyData.sort(function(a, b) {
        return b.averageRecovery - a.averageRecovery;
    });

    // Extract company names and average recovery amounts
    var companyNames = companyData.map(function(d) { return d.company; });
    var averageRecoveryAmounts = companyData.map(function(d) { return d.averageRecovery; });

    // Create a bar chart using Plotly
    var data = [{
        x: companyNames,
        y: averageRecoveryAmounts,
        type: 'bar',
        text: averageRecoveryAmounts.map(function(val) { return '$' + val.toFixed(2); }),
        hoverinfo: 'text',
        marker: {
            color: 'steelblue'
        }
    }];

    var layout = {
        title: 'Average Recovery Amount by Insurance Company',
        xaxis: {
            title: 'Insurance Company',
            tickangle: -45,
            automargin: true
        },
        yaxis: {
            title: 'Average Recovery Amount',
            automargin: true
        }
    };

    Plotly.newPlot('visualization', data, layout);

}).catch(function(error) {
    console.log(error);
});
