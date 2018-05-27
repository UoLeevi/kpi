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
                .querySelectorAll('.suggestion-box ul')
                .forEach(function (droplist) {
                    var droplistItems = supportedTickerSymbols.map(
                        function (ticker) {
                            var li = document.createElement("li");
                            li.innerText = ticker.toUpperCase();
                            li.dataset.ticker = ticker.toUpperCase();
                            return li;
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
            var suggestionBox = document.querySelector('.suggestion-box');
            var droplist = suggestionBox.querySelector('ul');
            var addIntradayQuotesInput = suggestionBox.querySelector('input:not([disabled="disabled"])');
            var autocompleteInput = suggestionBox.querySelector('input[disabled="disabled"]');
            var addIntradayQuotesButton = suggestionBox.querySelector('button');

            if (document.activeElement === addIntradayQuotesInput)
                suggestionBox.classList.add("focus");

            droplist.addEventListener(
                "mousedown",
                function (e) {
                    var ticker = e.target.dataset.ticker;
                    if (ticker && supportedTickerSymbols.indexOf(ticker) !== 0) {
                        autocompleteInput.value = ticker;
                        addIntradayQuotesInput.value = ticker;
                        updateAddIntradayQuotesButtonEnabled();
                    }
                });

            suggestionBox.firstElementChild.addEventListener(
                "focusin",
                function (e) {
                    updateSuggestionDroplist();
                    suggestionBox.classList.add("focus");
                });
            suggestionBox.firstElementChild.addEventListener(
                "focusout",
                function (e) {
                    suggestionBox.classList.remove("focus");
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
                                droplist.firstElementChild.classList.add("pre-selected");
                            }
                            break;
                        case "Enter":
                            addIntradayQuotesInput.value = currentSelection.dataset.ticker;
                            autocompleteInput.value = currentSelection.dataset.ticker;
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
                    .querySelectorAll('.suggestion-box ul')
                    .forEach(function (droplist) {
                        droplist.children.forEach(function (li) {
                            li.classList.remove("show");
                            if (tickers.indexOf(li.dataset.ticker) !== -1)
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