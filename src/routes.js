const express = require('express');
const axios = require('axios');
const routes = express.Router();
require('dotenv/config');


routes.get('/data/:symbol', async (req, res) => {
    const { symbol } = req.params;

    try{
        var d = new Date();
        const weekday = d.getDay();
        console.log(weekday)
        const year = d.getFullYear()
        let month = d.getMonth() + 1 
        if(month <= 9){
            month = `0${month}`
        }
        let dayCorrect
        if(weekday <= 7  && weekday > 0){
            dayCorrect = 1
        }else if(weekday == 0){
            dayCorrect = 2
        }
        let day = d.getDate() - dayCorrect;
        
        if(day <=9){
            day = `0${day}`
        }

        const fullDate = `${year}-${month}-${day}`

        const stockReq = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${process.env.ALPHA_VANTAGE_KEY}`)

        const stock1 = stockReq.data

        const stock = stock1["Meta Data"]["2. Symbol"]
        const stockOpen = parseFloat(stock1["Time Series (Daily)"][fullDate]["1. open"]);
        const stockHigh = parseFloat(stock1["Time Series (Daily)"][fullDate]["2. high"]);
        const stockLow = parseFloat(stock1["Time Series (Daily)"][fullDate]["3. low"]);
        const stockClose = parseFloat(stock1["Time Series (Daily)"][fullDate]["4. close"]);
        const stockVolume = parseFloat(stock1["Time Series (Daily)"][fullDate]["5. volume"]);

        const final = {
            symbol: stock,
            open: stockOpen,
            high: stockHigh,
            low: stockLow,
            close:stockClose,
            volume: stockVolume,
            date: fullDate
        }

        res.json(final);
    }catch(e){
        console.log("Deu erro" + e)
    }
})

routes.get('/data/a/:symbol', async (req, res) => {
    const { symbol } = req.params;

    console.log(symbol);

    const stockReq = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${process.env.ALPHA_VANTAGE_KEY}`)

    res.json(stockReq.data)
})

module.exports = routes;