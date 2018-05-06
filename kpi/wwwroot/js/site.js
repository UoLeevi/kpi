(function () {
    Chart.defaults.global.defaultFontColor = '#666666';
    Chart.defaults.global.defaultFontFamily = 'Open Sans';

    var chartSettings = {
        type: 'line',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "KPI",
                backgroundColor: '#3366ff',
                borderColor: '#f18805',
                data: [0, 25, 10, 5, 35, 50, 100],
            }]
        },
        options: {
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
                setTimeout(function () { new Chart(ctx, chartSettings); }, 400);
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