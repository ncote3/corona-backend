exports = module.exports = dataScraper;
function dataScraper () {
    const axios = require('axios');
    const cheerio = require('cheerio');

    const scraperUrl = 'https://www.worldometers.info/coronavirus/#countries';
    let data = {
        northAmerica: {},
        southAmerica: {},
        europe: {},
        asia: {},
        africa: {},
        caribbean: {},
        middleEast: {},
        oceania: {},
        other: {},
    };

    const northAmerica = ['USA', 'Canada', 'Mexico'];

    const southAmerica = ['Brazil', 'Ecuador', 'Chile', 'Panama', 'Peru', 'Argentina', 'Colombia', 'Uruguay',
        'Costa Rica', 'Venezuela', 'Paraguay', 'Honduras', 'Bolivia', 'Guatemala', 'El Salvador', 'Nicaragua',
        'Belize', 'French Guiana', 'Suriname', 'Guyana', ];

    const europe = ['Italy', 'Spain', 'Germany', 'France', 'Switzerland', 'UK', 'Netherlands', 'Austria', 'Belgium',
        'Norway', 'Portugal', 'Sweden', 'Denmark', 'Czechia', 'Luxembourg', 'Ireland', 'Poland', 'Romania', 'Finland',
        'Greece', 'Russia', 'Slovenia', 'Croatia', 'Estonia', 'Serbia', 'Lithuania', 'Bulgaria', 'Hungary', 'Latvia',
        'Slovakia', 'Bosnia and Herzegovina', 'Albania', 'Moldova', 'Ukraine', 'Belarus', 'Georgia', 'Liechtenstein',
        'Monaco', 'Vatican City', 'Iceland', 'Andorra', 'San Marino', 'North Macedonia', 'Faeroe Islands', 'Malta',
        'Cyprus', 'Azerbaijan', 'Montenegro', 'Channel Islands', 'Gibraltar', 'Isle of Man', 'Greenland',];

    const asia = ['China', 'S. Korea', 'Japan', 'Thailand', 'Singapore', 'Hong Kong', 'Taiwan', 'Vietnam', 'Cambodia',
        'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Mongolia', 'Turkey', 'Malaysia', 'Indonesia', 'Philippines', 'India',
        'Armenia', 'Brunei ', 'Sri Lanka', 'Bangladesh', 'Macao', 'Maldives', 'Bhutan', 'Timor-Leste', ];

    const africa = ['South Africa', 'Egypt', 'Algeria', 'Tunisia', 'Morocco', 'Ivory Coast', 'Cameroon', 'Ghana',
        'Palestine', 'DRC', 'Nigeria', 'Rwanda','Kenya', 'Madagascar', 'Uganda', 'Ethiopia', 'Niger', 'Congo', 'Sudan',
        'Zimbabwe', 'Chad', 'Liberia', 'Libya', 'Somalia', 'Syria', 'Burkina Faso', 'Réunion', 'Senegal', 'Mauritius',
        'Mayotte', 'Togo', 'Tanzania', 'Zambia', 'Djibouti', 'Equatorial Guinea', 'Namibia', 'Benin', 'Mozambique',
        'Cabo Verde', 'Guinea', 'Eswatini', 'Gambia', 'Angola', 'Guinea-Bissau', 'Mali', 'Mauritania', 'Eritrea',
        'CAR', 'Seychelles',];

    const middlEast = ['Iran', 'Pakistan', 'Saudi Arabia', 'Qatar', 'Bahrain', 'Iraq', 'Lebanon', 'UAE', 'Kuwait',
        'Jordan', 'Oman', 'Afghanistan', 'Nepal', 'Laos', 'Myanmar', 'Israel'];

    const caribbean = ['Dominican Republic', 'Guadeloupe', 'Cuba', 'Martinique', 'Trinidad and Tobago', 'Jamaica',
        'Barbados', 'Aruba', 'Saint Martin', 'Dominica', 'Haiti', 'Cayman Islands', 'Curaçao', 'Gabon', 'Bermuda',
        'Bahamas', 'Antigua and Barbuda', 'St. Barth', 'Saint Lucia', 'Sint Maarten', 'Grenada', 'Montserrat',
        'St. Vincent Grenadines', 'Turks and Caicos'] ;

    const oceania = ['New Zealand', 'French Polynesia', 'New Caledonia', 'Fiji', 'Papua New Guinea', 'Australia',];


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

                const sanitizedData = {
                    name,
                    totalCases,
                    newCases,
                    popDead,
                    newDeaths,
                    popRecovered,
                    popInfected,
                    seriousInfected
                };

                if (europe.includes(name)) {
                    data.europe[name] = sanitizedData;
                } else if (africa.includes(name)) {
                    data.africa[name] = sanitizedData;
                } else if (southAmerica.includes(name)) {
                    data.southAmerica[name] = sanitizedData;
                } else if (caribbean.includes(name)) {
                    data.caribbean[name] = sanitizedData;
                } else if (asia.includes(name)) {
                    data.asia[name] = sanitizedData;
                } else if (middlEast.includes(name)) {
                    data.middleEast[name] = sanitizedData;
                } else if (oceania.includes(name)) {
                    data.oceania[name] = sanitizedData;
                } else if (northAmerica.includes(name)) {
                    data.northAmerica[name] = sanitizedData;
                } else {
                    data.other[name] = sanitizedData;
                }
            });
            delete data.other['<span style="color:#00B5F0; font-style:italic; ">Diamond Princess</span>'];
            delete data.other['<strong>Total:</strong>'];
            delete data.other['R&#xE9;union'];
            delete data.other['Cura&#xE7;ao'];

            return data;
        })
        .catch(err => {
            console.log(err)
        });
}
