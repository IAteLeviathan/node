const express = require('express');
const axios = require('axios');
const hbs = require('hbs');
const _ = require('lodash');
const fs = require('fs');
const port = process.env.PORT || 8080;

var app = express();


app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

var getCountry = async () => {
    try {
        var country_canada = await axios.get(`https://restcountries.eu/rest/v2/name/Canada?fullText=true`);
        var coded_canada = country_canada.data[0].currencies[0].code;
        var conversion_rate = await axios.get(`https://api.exchangeratesapi.io/latest?symbols=` + encodeURIComponent(coded_canada) + `&base=USD`);
        var rate = conversion_rate.data.rates[`${coded_canada}`];

        response.render('currency.hbs', {
            title: "Currency Page",
            header: "Currency Conversion",
            welcome: 'Woohoo',
            output: `1 USD = ${_.round(rate, 2)} ${coded_canada}`
        });
    } catch (e) {
        if (coded_canada === undefined) {
            response.render('currency.hbs', {
                title: "Currency Page",
                header: "Error Page",
                welcome: "Awww",
                output: 'Country does not exist'
            });
        } else if (rate === undefined) {
            response.render('currency.hbs', {
                title: "Currency Page",
                header: "Error Page",
                welcome: "Awww",
                output: 'Rate does not exist'
            })
        }
    }
};

// app.use((request, response) => {
//     response.render('down.hbs');
// });

app.use((request, response, next) => {
    var time = new Date().toString();
    var log = `${time}: ${request.method} ${request.url}`;
    fs.appendFile('server.log', log + '\n', (error) => {
        if (error) {
            console.log('Unable to log message');
        }
    });
    next()
});

app.get('/', (request, response) => {
    response.render('main.hbs', {
        title:'Challenge',
        about:'About me',
        currency:'Currency Conversion Form Canada To USA'
    });
});

app.get('/about', (request, response) => {
    response.render('about.hbs', {
        title:'About me',
        paragraph:'My name is Alex Cho and I like sushi!'
    });
});

app.get('/currency', async (request, response) => {
    try {
        var country_canada = await axios.get(`https://restcountries.eu/rest/v2/name/Canada?fullText=true`);
        var coded_canada = country_canada.data[0].currencies[0].code;
        var conversion_rate = await axios.get(`https://api.exchangeratesapi.io/latest?symbols=` + encodeURIComponent(coded_canada) + `&base=USD`);
        var rate = conversion_rate.data.rates[`${coded_canada}`];

        response.render('currency.hbs', {
            title: "Currency Page",
            header: "Currency Conversion",
            welcome: 'Woohoo',
            output: `1 USD = ${_.round(rate, 2)} ${coded_canada}`
        });
    } catch (e) {
        if (coded_canada === undefined) {
            response.render('currency.hbs', {
                title: "Currency Page",
                header: "Error Page",
                welcome: "Awww",
                output: 'Country does not exist'
            });
        } else if (rate === undefined) {
            response.render('currency.hbs', {
                title: "Currency Page",
                header: "Error Page",
                welcome: "Awww",
                output: 'Rate does not exist'
            })
        }
    }
});

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`)
});
