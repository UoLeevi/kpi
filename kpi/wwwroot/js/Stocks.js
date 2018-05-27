NodeList.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.forEach = Array.prototype.forEach;

NodeList.prototype.indexOf = Array.prototype.indexOf;
HTMLCollection.prototype.indexOf = Array.prototype.indexOf;

Chart.defaults.global.defaultFontColor = '#666666';
Chart.defaults.global.defaultFontFamily = 'Open Sans';
Chart.defaults.global.elements.rectangle.borderWidth = 3;

(function () {
    var supportedTickerSymbols = [];

    var initiateSuggestionBoxesWhenReady = countDown(2,
        function () {
            document
                .querySelectorAll('.autocomplete ul.droplist')
                .forEach(function (droplist) {
                    var droplistItems = supportedTickerSymbols.map(
                        function (ticker) {
                            return createElementFromHTML(
                                '<li class="' + ticker.toLowerCase() + '">' + ticker.toUpperCase() + '</li>');
                        });
                    droplistItems.forEach(droplist.appendChild.bind(droplist));
                });
        });

    document.addEventListener(
        "DOMContentLoaded",
        initiateSuggestionBoxesWhenReady);

    var connection = new signalR.HubConnectionBuilder()
        //.withUrl("http://localhost:5099/hubs/stocks")
        .withUrl("https://api.kpi.app/hubs/stocks")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    var charts = {};

    connection.on(
        "ReceiveQuotes",
        function (instrument, quotes) {
            console.log(quotes);

            var prices = quotes.map(function (q) { return q.price; });
            var timePoints = quotes.map(function (q) { return q.time.slice(11, 16); });
            var chart = undefined;

            if (chart = charts[instrument.symbol])
                rollData(chart, timePoints, prices);
            else
                charts[instrument.symbol] = createChartForTicker(
                    instrument.symbol,
                    timePoints,
                    prices);

            function rollData(
                chart,
                newLabels,
                newValues) {

                chart.data.labels.splice(0, newLabels.length);
                Array.prototype.push.apply(chart.data.labels, newLabels);

                chart.data.datasets[0].data.splice(0, newValues.length);
                Array.prototype.push.apply(chart.data.datasets[0].data, newValues);

                chart.update({
                    duration: 800 * newValues.length,
                    easing: 'easeOutCubic'
                });
            }
        });

    connection.on(
        "ReceiveSupportedTickerSymbols",
        function (tickerSymbols) {
            supportedTickerSymbols = tickerSymbols.sort();
            initiateSuggestionBoxesWhenReady();
        });

    connection.on(
        "Connected",
        function () {
            connection
                .invoke("SendSupportedTickerSymbolsToCaller")
                .catch(console.error);
        });

    connection
        .start()
        .catch(console.error);

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            var autocompleteContainer = document.querySelector('.autocomplete');
            var droplist = autocompleteContainer.querySelector('ul.droplist');
            var autocompleteInput = autocompleteContainer.querySelector('input[disabled="disabled"]');

            if (document.activeElement === addIntradayQuotesInput)
                autocompleteContainer.classList.add("focus");

            droplist.addEventListener(
                "mousedown",
                function (e) {
                    var ticker = e.target.classList[0].toUpperCase();
                    if (ticker && supportedTickerSymbols.indexOf(ticker) !== 0) {
                        autocompleteInput.value = ticker;
                        addIntradayQuotesInput.value = ticker;
                        updateAddIntradayQuotesButtonEnabled();
                    }
                });

            autocompleteContainer.addEventListener(
                "focusin",
                function (e) {
                    updateSuggestionDroplist();
                    autocompleteContainer.classList.add("focus");
                });
            autocompleteContainer.addEventListener(
                "focusout",
                function (e) {
                    autocompleteContainer.classList.remove("focus");
                });

            addIntradayQuotesInput.addEventListener(
                "keydown",
                function (e) {
                    var currentSelection = droplist.querySelector(".pre-selected");
                    var matches = droplist.querySelectorAll(".show");
                    var indexOfCurrentSelection = matches.indexOf(currentSelection);

                    switch (e.key) {
                        case "Tab":
                            addIntradayQuotesInput.value = autocompleteInput.value;
                            updateAddIntradayQuotesButtonEnabled();
                            break;
                        case "ArrowUp":
                            if (currentSelection) {
                                currentSelection.classList.remove("pre-selected");
                                if (--indexOfCurrentSelection >= 0)
                                    matches[indexOfCurrentSelection].classList.add("pre-selected");
                            }
                            break;
                        case "ArrowDown":
                            if (currentSelection) {
                                currentSelection.classList.remove("pre-selected");
                                if (++indexOfCurrentSelection < matches.length)
                                    matches[indexOfCurrentSelection].classList.add("pre-selected");
                            } else {
                                droplist.firstChild.classList.add("pre-selected");
                            }
                            break;
                        case "Enter":
                            addIntradayQuotesInput.value = currentSelection.classList[0].toUpperCase();
                            autocompleteInput.value = currentSelection.classList[0].toUpperCase();
                            updateSuggestionDroplist();
                            updateAddIntradayQuotesButtonEnabled();
                            break;
                    }
                        
                });
            addIntradayQuotesInput.addEventListener(
                "input",
                function () {
                    if (addIntradayQuotesInput.value.length > 0)
                        autocompleteInput.value = findFirstTickerSymbolStartingWith(addIntradayQuotesInput.value) || addIntradayQuotesInput.value;
                    else
                        autocompleteInput.value = null;
                    updateSuggestionDroplist();
                    updateAddIntradayQuotesButtonEnabled();
                });

            addIntradayQuotesButton.addEventListener(
                "click",
                function (e) {
                    e.preventDefault();
                    if (!addIntradayQuotesButton.classList.contains("enabled"))
                        return;
                    var t = addIntradayQuotesInput.value.toUpperCase();
                    addIntradayQuotesInput.value = null;
                    autocompleteInput.value = null;
                    updateAddIntradayQuotesButtonEnabled();
                    connection
                        .invoke("SubscribeCallerToQuotes", [t])
                        .catch(console.error);
                });

            function updateAddIntradayQuotesButtonEnabled() {
                if (supportedTickerSymbols.indexOf(addIntradayQuotesInput.value.toUpperCase()) !== -1)
                    addIntradayQuotesButton.classList.add("enabled");
                else
                    addIntradayQuotesButton.classList.remove("enabled");
            }

            function updateSuggestionDroplist() {
                var tickers = addIntradayQuotesInput.value.length > 0
                    ? findTickerSymbolsStartingWith(addIntradayQuotesInput.value)
                    : supportedTickerSymbols;

                document
                    .querySelectorAll('.autocomplete ul.droplist')
                    .forEach(function (droplist) {
                        droplist.children.forEach(function (li) {
                            li.classList.remove("show");
                            if (tickers.indexOf(li.className.toUpperCase()) !== -1)
                                li.classList.add("show");
                        });
                    });
            }

            function findTickerSymbolsStartingWith(searchString) {
                return supportedTickerSymbols.filter(
                    function (tickerSymbol) {
                        return tickerSymbol.startsWith(searchString.toUpperCase());
                    });
            }

            function findFirstTickerSymbolStartingWith(searchString) {
                for (var i = 0; i < supportedTickerSymbols.length; ++i)
                    if (supportedTickerSymbols[i].startsWith(searchString.toUpperCase()))
                        return supportedTickerSymbols[i];
            }
        });

    function createChartForTicker(
        tickerSymbol,
        labels,
        data) {

        document.getElementById("chart-grid").appendChild(
            createElementFromHTML(
                '<div class="container-40vw-20vw intraday-' + tickerSymbol.toLowerCase() + '"><canvas></canvas></div>'));

        var canvas = document.querySelector('.intraday-' + tickerSymbol.toLowerCase() + ' canvas');
        return new Chart(
            canvas.getContext('2d'),
            {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: tickerSymbol,
                        borderColor: '#f18805',
                        data: data
                    }]
                }
            });
    }

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        return div.firstChild;
    }

    function countDown(
        count,
        callback) {
        return function () {
            if (--count === 0)
                callback();
        };
    } 
})();