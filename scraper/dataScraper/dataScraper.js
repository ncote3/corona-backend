exports = module.exports = dataScraper;
function dataScraper () {
    const axios = require('axios');
    const cheerio = require('cheerio');

    const scraperUrl = 'https://www.worldometers.info/coronavirus/#countries';
    let data = {};
    return axios.get(scraperUrl)
        .then(res => {
            const $ = cheerio.load(res.data);
            $('#main_table_countries_today tbody tr').each((i, elem) => {
                const name = ($(elem).find('td .mt_a').html() !== null)
                    ? $(elem).find('td .mt_a').html()
                    : $(elem).find('td').eq(0).html();

                let totalCases = $(elem).find('td').eq(1).html();
                let newCases = $(elem).find('td').eq(2).html();
                let popDead = $(elem).find('td').eq(3).html();
                let newDeaths = $(elem).find('td').eq(4).html();
                let popRecovered = $(elem).find('td').eq(5).html();
                let popInfected = $(elem).find('td').eq(6).html();
                let seriousInfected = $(elem).find('td').eq(7).html();

                if (totalCases) {totalCases = parseInt(totalCases.replace(/,/g, ''), 10)}
                if (popDead) {popDead = parseInt(popDead.replace(/,/g, ''), 10)}
                if (popRecovered) {popRecovered = parseInt(popRecovered.replace(/,/g, ''), 10)}
                if (popInfected) {popInfected = parseInt(popInfected.replace(/,/g, ''), 10)}
                if (seriousInfected) {seriousInfected = parseInt(seriousInfected.replace(/,/g, ''), 10)}
                data[name] = {
                    name,
                    totalCases,
                    newCases,
                    popDead,
                    newDeaths,
                    popRecovered,
                    popInfected,
                    seriousInfected
                };
            });
            delete data['<span style="color:#00B5F0; font-style:italic; ">Diamond Princess</span>'];
            delete data['<strong>Total:</strong>'];
            delete data['R&#xE9;union'];
            delete data['Cura&#xE7;ao'];

            return data;
        })
        .catch(err => {
            console.log(err)
        });
}
