const API_KEY = '0f9b61236d4221119b4374b94cf660400cdd5e8bc1eb236be31120fd1e6d6aec';

const tickers = new Map();
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

const AGGREGATE_INDEX = "5";
socket.addEventListener("message", (e) => {
    const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data);
    if(type !== AGGREGATE_INDEX){
        return;
    }
    const handlers = tickers.get(currency) ?? [];
    handlers.forEach(fn => fn(newPrice));
})

export const subscribeToTicker = function (ticker, cb){
    const subscribers = tickers.get(ticker) || [];
    tickers.set(ticker, [...subscribers, cb]);
    subscribeToTickerOnWs(ticker);
}

export const  unsubscribeToTicker = function (ticker){
    tickers.delete(ticker);
    unsubscribeToTickerOnWs(ticker);
}

function sendToWebSocket(message) {
    const stringifiedMessage = JSON.stringify(message)
    if(socket.readyState === WebSocket.OPEN){
        socket.send(stringifiedMessage);
        return;
    }

    socket.addEventListener('open', () => {
       socket.send(stringifiedMessage);
    },{once: true});
}

function subscribeToTickerOnWs(ticker) {
    sendToWebSocket({
        action: "SubAdd",
        subs: [`5~CCCAGG~${ticker}~USD`]
    });
}
function unsubscribeToTickerOnWs(ticker) {
    sendToWebSocket({
        action: "SubRemove",
        subs: [`5~CCCAGG~${ticker}~USD`]
    });
}
window.tickers = tickers;