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
            var ctx = document.getElementById('kpi-chart').getContext('2d');

            yourcompanyKpiAppAnchor.addEventListener(
                "click",
                drawChartOnce)

            function drawChartOnce() {
                var chart = new Chart(ctx, chartSettings);
                yourcompanyKpiAppAnchor.removeEventListener("click", drawChartOnce);
            }
        });
})();