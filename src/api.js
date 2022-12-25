const API_KEY = '0f9b61236d4221119b4374b94cf660400cdd5e8bc1eb236be31120fd1e6d6aec';

export const loadTickers = (tickerList) => {
    return fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickerList}&api_key=${API_KEY}`)
        .then(response => response.json())
        .then(rawData => Object.fromEntries(Object.entries(rawData).map(([key, value]) => [key, 1 / value])
            )
        );
}