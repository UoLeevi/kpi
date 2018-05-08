(function () {
    Chart.defaults.global.defaultFontColor = '#666666';
    Chart.defaults.global.defaultFontFamily = 'Open Sans';

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function rollData(
        chart,
        newLabel,
        newValue) {
        chart.data.labels.shift();
        chart.data.labels.push(newLabel);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.shift();
            dataset.data.push(newValue);
        });
        chart.update();
    }

    var monthData = {
        labels: months.slice(0, 12),
        datasets: [{
            label: "KPI",
            backgroundColor: '#3366ff',
            borderColor: '#f18805',
            data: [0, 15, 10, 5, 25, 30, 40, 45, 41, 35, 44, 51],
        }]
    };

    var chartSettings = {
        type: 'line',
        data: monthData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        suggestedMax: 60
                    }
                }]
            }
        }
    };

    document.addEventListener(
        "DOMContentLoaded",
        function (event) {
            var yourcompanyKpiAppAnchor = document.getElementById("kpi-yourcompany");
            var chartContainer = document.getElementById("chart-container");
            var ctx = document.getElementById('kpi-chart').getContext('2d');

            yourcompanyKpiAppAnchor.addEventListener(
                "click",
                drawChartOnce);

            var typing = new TypingEffect(
                document.querySelector(".typing"),
                ["nextinvestment", "digitalsolutions", "engineeredsuccess", "industry4.0", "designagency", "yourname", "yourcompany"]);

            setTimeout(
                TypingEffect.prototype.start.bind(typing),
                2800);

            function drawChartOnce() {
                yourcompanyKpiAppAnchor.removeEventListener("click", drawChartOnce);

                typing.stop(StopTiming.AfterTyping);

                chartContainer.classList.remove("animation-paused");
                setTimeout(function () {
                    var monthsChart = new Chart(ctx, chartSettings);
                    var monthIndex = monthsChart.data.labels.length - 1;

                    setInterval(
                        function () {
                            rollData(
                                monthsChart,
                                months[++monthIndex % months.length],
                                getRandomNewValue(
                                    monthsChart.data.datasets[0].data[11],
                                    100,
                                    0,
                                    10));
                        },
                        1500);

                    function getRandomNewValue(
                        previousValue,
                        maxValue,
                        minValue,
                        maxChange) {
                        return Math.min(
                            Math.max(
                                previousValue + Math.floor(
                                    (Math.random() - .5) * 2 * maxChange),
                                0),
                            100);
                    }
                }, 400);
            }
        });

})();