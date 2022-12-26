const API_KEY = '0f9b61236d4221119b4374b94cf660400cdd5e8bc1eb236be31120fd1e6d6aec';

const tickers = new Map();

const loadTickers = () => {
    if(tickers.size === 0){
        return;
    }

    return fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickers.keys()].join(',')}&tsyms=USD&api_key=${API_KEY}`)
        .then(response => response.json())
        .then(rawData => {
            const updatedPrices = Object.fromEntries(Object.entries(rawData).map(([key, value]) => [key, value.USD]))
            Object.entries(updatedPrices).forEach(([currrency, newPrice]) => {
                const handlers = tickers.get(currrency) ?? [];
                handlers.forEach(fn => fn(newPrice));
            })
        });
}

export const subscribeToTicker = function (ticker, cb){
    const subscribers = tickers.get(ticker) || [];
    tickers.set(ticker, [...subscribers, cb]);
}

export const  unsubscribeToTicker = function (ticker){
    tickers.delete(ticker);
}

setInterval(loadTickers, 5000);
window.tickers = tickers;