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
                chartSettings.data.datasets[0].backgroundColor = '#3366ff';
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
                chartSettings.data.datasets[0].pointBorderColor = '#f18805';
                chartSettings.data.datasets[0].pointBackgroundColor = '#3366ff';
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
                    changeHue('#3366ff', -30),
                    changeHue('#3366ff', -25),
                    changeHue('#3366ff', -20),
                    changeHue('#3366ff', -15),
                    changeHue('#3366ff', -10),
                    changeHue('#3366ff', -5),
                    changeHue('#3366ff', 0),
                    changeHue('#3366ff', 5),
                    changeHue('#3366ff', 10),
                    changeHue('#3366ff', 15),
                    changeHue('#3366ff', 20),
                    changeHue('#3366ff', 25)
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

    // Changes the RGB/HEX temporarily to a HSL-Value, modifies that value 
    // and changes it back to RGB/HEX.
    // https://stackoverflow.com/a/17433060
    function changeHue(
        rgb,
        degree) {
        var hsl = rgbToHSL(rgb);
        hsl.h += degree;
        if (hsl.h > 360) {
            hsl.h -= 360;
        }
        else if (hsl.h < 0) {
            hsl.h += 360;
        }
        return hslToRGB(hsl);

        // exepcts a string and returns an object
        function rgbToHSL(rgb) {
            // strip the leading # if it's there
            rgb = rgb.replace(/^\s*#|\s*$/g, '');

            // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
            if (rgb.length == 3) {
                rgb = rgb.replace(/(.)/g, '$1$1');
            }

            var r = parseInt(rgb.substr(0, 2), 16) / 255,
                g = parseInt(rgb.substr(2, 2), 16) / 255,
                b = parseInt(rgb.substr(4, 2), 16) / 255,
                cMax = Math.max(r, g, b),
                cMin = Math.min(r, g, b),
                delta = cMax - cMin,
                l = (cMax + cMin) / 2,
                h = 0,
                s = 0;

            if (delta === 0) {
                h = 0;
            }
            else if (cMax === r) {
                h = 60 * (((g - b) / delta) % 6);
            }
            else if (cMax === g) {
                h = 60 * (((b - r) / delta) + 2);
            }
            else {
                h = 60 * (((r - g) / delta) + 4);
            }

            if (delta === 0) {
                s = 0;
            }
            else {
                s = (delta / (1 - Math.abs(2 * l - 1)));
            }

            return {
                h: h,
                s: s,
                l: l
            };
        }

        // expects an object and returns a string
        function hslToRGB(hsl) {
            var h = hsl.h,
                s = hsl.s,
                l = hsl.l,
                c = (1 - Math.abs(2 * l - 1)) * s,
                x = c * (1 - Math.abs((h / 60) % 2 - 1)),
                m = l - c / 2,
                r, g, b;

            if (h < 60) {
                r = c;
                g = x;
                b = 0;
            }
            else if (h < 120) {
                r = x;
                g = c;
                b = 0;
            }
            else if (h < 180) {
                r = 0;
                g = c;
                b = x;
            }
            else if (h < 240) {
                r = 0;
                g = x;
                b = c;
            }
            else if (h < 300) {
                r = x;
                g = 0;
                b = c;
            }
            else {
                r = c;
                g = 0;
                b = x;
            }

            r = normalize_rgb_value(r, m);
            g = normalize_rgb_value(g, m);
            b = normalize_rgb_value(b, m);

            return rgbToHex(r, g, b);
        }

        function normalize_rgb_value(color, m) {
            color = Math.floor((color + m) * 255);
            if (color < 0) {
                color = 0;
            }
            return color;
        }

        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
    }

})();