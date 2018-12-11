const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('./middlewares/auth');
const cookieSession = require('cookie-session');

const bodyParser = require('body-parser');
const express = require('express');
const models = require('./models');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Uncomment the following if you want to serve up static assets.
// (You must create the public folder)
/*
app.use(express.static('./public'));
*/

// Uncomment the following if you want to use handlebars
// on the backend. (You must create the views folder)
/*
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  layoutsDir: './views/layouts',
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views/`);
*/

app.use(cookieParser());
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['keyboard_cat_michelle']
}));

app.use(expressSession(({
  secret: 'keyboard cat - REPLACE ME WITH A BETTER SECRET',
  resave: false,
  saveUninitialized: true,
})));

app.use(passport.initialize());
app.use(passport.session());

// load up controllers and route handlers now...

// Load up all of the controllers
const controllers = require('./controllers');
const dashboard = require('./controllers/dashboard');
app.use('/api',controllers)
// app.use('/dashboard',dashboard)



// First, make sure the Database tables and models are in sync
// then, start up the server and start listening.
models.sequelize.sync({force: false})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is up and running on port: ${PORT}`)
    });
  });
