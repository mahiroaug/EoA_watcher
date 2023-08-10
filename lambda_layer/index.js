const { IncomingWebhook } = require("@slack/webhook");
const Web3 = require('web3');
const ccxt = require('ccxt');


exports.handler = async (event, context) => {
    
    // definition
    const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
    const INFURA_URL = process.env.INFURA_URL;
    const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";
    const binanceExchange = new ccxt.binance({ enableRateLimit: true });
    const web3 = new Web3(
        new Web3.providers.HttpProvider(
            `${INFURA_URL}${INFURA_PROJECT_ID}`
        )
    );

    // function
    const fetch_ETH_Balance = async (addr) => {
        try {
            const balanceWEI = await web3.eth.getBalance(addr);
            console.log("balanceWEI: ",balanceWEI);
            const balanceETH = await web3.utils.fromWei(balanceWEI, 'ether');
            console.log("balanceETH: ",balanceETH);
            return balanceETH;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const fetch_price_In_USD = async () => {
        try {
            const tickerInfo = await binanceExchange.fetchTicker('ETH/USD');
            return tickerInfo.last;
        } catch (err) {
            console.error(err);
            return null;
        }
    };



    // setting
    const today = new Date();
    const formattedDate = today
        .toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
        .split("/")
        .join("-");
    const formattedTime = today
        .toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Asia/Tokyo",
        });
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    const address = process.env.WATCH_ADDRESS01;


    // main
    console.log('Address: ', address);
    const balanceETH = await fetch_ETH_Balance(address);
    console.log('balance ETH: ', balanceETH);
    const priceUSD = await fetch_price_In_USD();
    let balanceUSD = null;
    if(balanceETH !== null && priceUSD !== null){
        balanceUSD = await parseFloat(balanceETH) * priceUSD;
        console.log('by USD: ', balanceUSD);
    }

    let message = "";
    message += "<!channel>";
    message += "ETH残高をお知らせしミャク〜\n";
    message += "- Date : `" + formattedDateTime + "`\n"; 
    message += "- ADDRESS : `" + address + "`\n";
    message += "- ETH BALANCE : `" + balanceETH + " ETH`\n";
    if (balanceUSD !== null) {
        message += "---> by USD : `" + balanceUSD + " USD` (exchange rate : `" + priceUSD + " USD/ETH`)\n";
    } else {
        message += "---> by USD : N/A\n";
    }

    // post message
    (async () => {
        await webhook.send({
            text: message,
        });
    })();


    //****** READABILITY FOR ROBOT *****//
    if (balanceUSD !== null) {
        console.log("READABILITY FOR ROBOT");
        let message2 = "";
        message2 += "oneLiner," + formattedDateTime + "," + address + "," + balanceETH + "," + balanceUSD + "," + priceUSD + "\n";

        // post message2
        (async () => {
            await webhook.send({
                text: message2,
            });
        })();

    }

}



