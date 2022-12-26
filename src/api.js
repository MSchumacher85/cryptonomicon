const API_KEY = '0f9b61236d4221119b4374b94cf660400cdd5e8bc1eb236be31120fd1e6d6aec';

const tickers = new Map();

export const loadTickers = (tickerList) => {
    return fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickerList.join(',')}&tsyms=USD&api_key=${API_KEY}`)
        .then(response => response.json())
        .then(rawData => Object.fromEntries(Object.entries(rawData).map(([key, value]) => [key, value.USD])
            )
        );
}

export const subscribeToTicker = function (ticker, cb){
    const subscribers = tickers.get(ticker) || [];
    tickers.set(ticker, [...subscribers, cb]);
}

export const  unsubscribeToTicker = function (ticker, cd){
    const subscribers = tickers.get(ticker) || [];
    tickers.set(ticker, subscribers.filter(fn => fn != cd));
}