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

            setTimeout(
                function () {
                    typing(
                        document.querySelector(".typing"),
                        ["nextinvestment", "digitalsolutions", "engineeredsuccess", "industry4.0", "designagency", "yourname", "yourcompany"]
                    );
                },
                2800);

            function drawChartOnce() {
                yourcompanyKpiAppAnchor.removeEventListener("click", drawChartOnce);
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

    function typing(
        elementToType,
        textsToType) {
        var i = 0;

        var delayBetweenUntypeChar = 70;
        var delayBetweenTypeChar = 130;
        var delayBeforeUntype = 1300;
        var delayBeforeType = 400;

        var untype = setInterval(
            function () {
                if (elementToType.innerText.length > 0) {
                    elementToType.innerText = elementToType.innerText.slice(0, -1);
                } else {
                    clearInterval(untype);
                    (function typeText(i) {
                        var j = 0;
                        var textToType = textsToType[i];
                        var typeLetterByLetter = setInterval(
                            function () {
                                var letter = textToType[j];
                                elementToType.innerText += letter;
                                if (++j === textToType.length) {
                                    clearInterval(typeLetterByLetter);
                                    setTimeout(
                                        function () {
                                            var untypeLetterByLetter = setInterval(
                                                function () {
                                                    elementToType.innerText = elementToType.innerText.slice(0, -1);
                                                    if (--j === 0) {
                                                        setTimeout(
                                                            function () {
                                                                clearInterval(untypeLetterByLetter);
                                                                typeText(++i % textsToType.length);
                                                            },
                                                            delayBeforeType);
                                                    }
                                                },
                                                delayBetweenUntypeChar);
                                        },
                                        delayBeforeUntype);
                                }
                            },
                            delayBetweenTypeChar);
                    })(i);
                }
            },
            delayBetweenUntypeChar
        );
    }

})();