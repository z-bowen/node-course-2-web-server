const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

// Maintenance toggle
var maintenance = false

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

if (maintenance) {
  app.use((req, res, next) => {
    res.render('maintenance.hbs', {})
  });
}

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>');
  res.render('home.hbs', {
    pageTitle: 'Home',
    description: 'Welcome to my home page'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/help', (req, res) => {
  res.render('help.hbs', {
    pageTitle: 'Help Page'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
    description: 'Here is a link to my GitHub profile'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Bad Request'
  })
})

app.listen(port, () => {
  console.log(`Server is listing on port ${port}`);
});
