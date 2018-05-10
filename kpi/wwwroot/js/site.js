(function () {
    Chart.defaults.global.defaultFontColor = '#666666';
    Chart.defaults.global.defaultFontFamily = 'Open Sans';
    Chart.defaults.global.elements.rectangle.borderWidth = 3;

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var chartTypeIndex = 0;
    var chartTypes = ["line", "bar", "radar", "pie", "doughnut"];

    var monthSeries = {
        labels: months.slice(0),
        values: [0, 15, 10, 5, 25, 30, 40, 45, 41, 35, 44, 51]
    };

    function getDefaultChartSettings(
        chartType) {

        var chartSettings = {
            type: chartType,
            data: {
                labels: monthSeries.labels,
                datasets: [{
                    label: "KPI",
                    borderColor: '#f18805',
                    data: monthSeries.values,
                }]
            }
        };

        switch (chartType) {
            case "line":
            case "bar":
                chartSettings.data.datasets[0].backgroundColor = 'rgba(51, 102, 204, 0.4)';
                chartSettings.options = {
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0,
                                suggestedMax: 60
                            }
                        }]
                    }
                };
                return chartSettings;


            case "radar":
                chartSettings.data.datasets[0].backgroundColor = 'rgba(51, 102, 204, 0.1)';
                chartSettings.data.datasets[0].pointBorderColor = '#f18805';
                chartSettings.data.datasets[0].pointBackgroundColor = 'rgba(51, 102, 204, 0.4)';
                chartSettings.data.datasets[0].lineTension = 0.1;
                chartSettings.options = {
                    legend: {
                        display: false
                    },
                    scale: {
                        ticks: {
                            backdropColor: 'rgba(0,0,0,0.1)'
                        }
                    }
                };
                return chartSettings;

            default:
                chartSettings.data.datasets[0].backgroundColor = [
                    'rgba(51, 102, 204, 0.00)',
                    'rgba(51, 102, 204, 0.08)',
                    'rgba(51, 102, 204, 0.16)',
                    'rgba(51, 102, 204, 0.24)',
                    'rgba(51, 102, 204, 0.32)',
                    'rgba(51, 102, 204, 0.40)',
                    'rgba(51, 102, 204, 0.48)',
                    'rgba(51, 102, 204, 0.56)',
                    'rgba(51, 102, 204, 0.64)',
                    'rgba(51, 102, 204, 0.72)',
                    'rgba(51, 102, 204, 0.80)',
                    'rgba(51, 102, 204, 0.88)'
                ];
                chartSettings.options = {
                    legend: {
                        position: 'right'
                    }
                };
                return chartSettings;
        }
    }

    document.addEventListener(
        "DOMContentLoaded",
        function (event) {
            var yourcompanyKpiAppAnchor = document.getElementById("kpi-yourcompany");
            var chartContainer = document.getElementById("chart-container");
            var canvas = document.getElementById('kpi-chart');

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
                yourcompanyKpiAppAnchor.removeEventListener(
                    "click",
                    drawChartOnce);

                typing.untypingFinished.addOnce(
                    function () { collapse(document.getElementById("kpi-tagline")); });
                typing.stop(StopTiming.AfterUntyping);

                chartContainer.classList.remove("animation-paused");
                setTimeout(function () {
                    var monthsChart = new Chart(
                        canvas.getContext('2d'),
                        getDefaultChartSettings(chartTypes[0]));

                    var monthIndex = monthsChart.data.labels.length - 1;

                    var rollDataInterval = setRollDataInterval();

                    canvas.addEventListener(
                        "click",
                        function (event) {
                            var nextChartType = chartTypes[++chartTypeIndex % chartTypes.length];
                            clearInterval(rollDataInterval);
                            monthsChart.destroy();
                            monthsChart = new Chart(
                                canvas.getContext('2d'),
                                getDefaultChartSettings(nextChartType));
                            rollDataInterval = setRollDataInterval();
                        });

                    function setRollDataInterval() {
                        return setInterval(
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
                            5000);
                    }

                    function getRandomNewValue(
                        previousValue,
                        maxValue,
                        minValue,
                        maxChange) {
                        return Math.min(
                            Math.max(
                                previousValue + Math.floor(
                                    (Math.random() - 0.5) * 2 * maxChange),
                                0),
                            100);
                    }
                }, 400);
            }
        });

    function rollData(
        chart,
        newLabel,
        newValue) {

        monthSeries.labels.shift();
        monthSeries.labels.push(newLabel);

        monthSeries.values.shift();
        monthSeries.values.push(newValue);

        chart.update({
            duration: 800,
            easing: 'easeOutCubic'
        });
    }

    function collapse(
        element) {
        element.addEventListener(
            "transitionend",
            function collapseOnce(event) {
                element.removeEventListener("transitionend", collapseOnce);
                element.classList.add("hidden");
            });
        element.classList.add("fade-out");
    }

})();