const express = require('express'),
			app = express(),
			cors = require('cors'),
			cities = require('../data/cities.json');

// Enable cross-origin resource sharing.
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-requested-withecx',
    'mode',
    'x-auth-user-name',
    'x-correlation-id',
    'x-source',
    'userKey'
  ],
  credentials: false,
  preflightContinue: true
}));

app.listen(8000, () => {
  console.log('Server started!');
});

app.route('/api/cities/:city/:country').get((req, res) => {
	const cityName = req.params['city'],
				countryName = req.params['country'];

	const result = cities.filter(cityObj => cityObj.name === cityName && cityObj.country === countryName.toUpperCase());

	res.send(result);
});
