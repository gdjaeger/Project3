// Load the data from the cleaned_data.csv file
d3.csv("/static/cleaned_data.csv").then(function(data) {
    // Group the data by coverage type and calculate the count for each
    var coverageData = d3.rollup(
        data,
        v => v.length,
        d => d.Coverage
    );

    // Create a pie chart using Chart.js
    var ctx = document.getElementById('visualization').getContext('2d');
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Array.from(coverageData.keys()),
            datasets: [{
                data: Array.from(coverageData.values()),
                backgroundColor: ['steelblue', 'green', 'orange', 'purple', 'red', 'blue', 'yellow', 'pink'],
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Distribution of Coverage Types',
                fontSize: 20,
            },
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 12,
                }
            }
        }
    });

}).catch(function(error) {
    console.log(error);
});
