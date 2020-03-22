exports = module.exports = dataScraper;
function dataScraper () {
    const axios = require('axios');
    const cheerio = require('cheerio');

    const scraperUrl = 'https://ncov2019.live/data';
    let data = {};
    return axios.get(scraperUrl)
        .then(res => {
            const $ = cheerio.load(res.data);
            $('#sortable_table_Global tbody tr').each((i, elem) => {
                let name = $(elem).find('.text--gray').html();
                let popInfected = $(elem).find('.text--green').html();
                let popCured = $(elem).find('.text--blue').html();
                let popDead = $(elem).find('.text--red').html();

                if (name) {
                    name = name.replace(/\s/g,'');
                }
                if (popInfected) {
                    popInfected = parseInt(popInfected.replace(/,/g, ''), 10);
                }
                if (popCured) {
                    popCured = parseInt(popCured.replace(/,/g, ''), 10);
                }
                if (popDead) {
                    popDead = parseInt(popDead.replace(/,/g, ''), 10);
                }
                data[name] = {name, popInfected, popCured, popDead}
            });

            return data;
        })
        .catch(err => {
            console.log(err)
        });
}
