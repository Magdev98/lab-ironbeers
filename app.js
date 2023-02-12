const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', (req, res) => {
  punkAPI
    .getBeers()
    .then(beersFromApi => res.render('beers', { beersFromApi }))
    .catch(error => console.log(error));
});

app.get('/random-beer', (req, res) => {
  punkAPI
    .getRandom()
    .then(responseFromAPI => {
      responseFromAPI[0].details = true;
      res.render('random-beer', { responseFromAPI });
    })
    .catch(error => console.log(error));
});

app.get('/beers/beer-:id', (req, res) => {
  const beerId = req.params.id;
  punkAPI
    .getBeer(beerId)
    .then(responseFromAPI => {
      res.render('random-beer', { responseFromAPI });
    })
    .catch(error => console.log(error));
});

app.use((req, res, next) => {
  const url = req.originalUrl;
  if (url === '/') {
    res.locals.title = 'Home';
  } else if (url.includes('beers')) {
    res.locals.title = 'Beers';
  } else {
    res.locals.title = 'Random Beer';
  }
  next();
});

app.listen(3000, () => console.log(`🏃‍ on http://localhost:3000`));
