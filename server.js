const dataScraper = require('./scraper/dataScraper/dataScraper');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

app.get('/api/PersonGrid', asyncMiddleware(async (req, res) => {
    const data = await dataScraper();

    const response = {
        data,
    };
    res.send(response);
}));

app.listen(port, () => console.log(`Listening on port ${port}`));
