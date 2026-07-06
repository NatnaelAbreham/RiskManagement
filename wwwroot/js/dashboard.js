fetch('/Checker/GetRiskTrend')
    .then(response => response.json())
    .then(data => {

        var options = {

            chart: {
                type: 'line',
                height: 350,
                toolbar: {
                    show: false
                }
            },

            series: [{
                name: 'Registered Risks',
                data: data.map(x => x.count)
            }],

            xaxis: {
                categories: data.map(x => x.month)
            },

            stroke: {
                curve: 'smooth',
                width: 4
            },

            markers: {
                size: 5
            },

            dataLabels: {
                enabled: false
            },

            grid: {
                borderColor: '#f1f1f1'
            },

            title: {
                text: 'Risk Registration Trend'
            }

        };

        new ApexCharts(document.querySelector("#riskTrendChart"), options).render();

    });

    fetch('/Checker/GetRiskRating')
    .then(response => response.json())
    .then(data => {

        var options = {

            chart: {
                type: 'donut',
                height: 350
            },
             colors: [
        "#28a745",
        "#ffc107",
        "#fd7e14",
        "#dc3545"
    ],

            series: data.map(x => x.count),

            labels: data.map(x => x.rating),

            legend: {
                position: 'bottom'
            },

            dataLabels: {
                enabled: true
            },

            plotOptions: {
                pie: {
                    donut: {
                        size: '65%'
                    }
                }
            },

            tooltip: {
                y: {
                    formatter: function (value) {
                        return value + " Risks";
                    }
                }
            }

        };

        new ApexCharts(document.querySelector("#riskRatingChart"), options).render();

    });

