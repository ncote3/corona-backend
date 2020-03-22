const dataScraper = require('./scraper/dataScraper/dataScraper');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

app.get('/api/PersonGrid', asyncMiddleware(async (req, res) => {
    console.log('I was hit!');
    const data = await dataScraper();

    const response = {
        country: {
            usa: data['UnitedStates'],
            france: data['France'],
        },
    };
    res.send(response);
}));

app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
