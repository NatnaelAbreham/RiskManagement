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

