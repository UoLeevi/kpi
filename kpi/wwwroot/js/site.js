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

            typing(
                document.querySelector(".typing"),
                ["yourcompany", "nextinvestment", "digitalsolutions", "modernmanufacturing", "industry4.0", "designagency", "yourname"]
            );

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
                                                400); // wait time between typing texts
                                        }
                                    },
                                    70); // wait time between untyping characters
                            },
                            1300); // wait time before starting to untyping characters
                    }
                },
                130); // wait time between typing characters
        })(i);
    }

})();