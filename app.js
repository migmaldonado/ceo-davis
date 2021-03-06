const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
var multer  = require('multer');
const pug          = require('pug');
// const stylus          = require('stylus');

const expressLayouts = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var users = require('./routes/users');
const authRoutes=require('./routes/auth');
const adminRoutes=require('./routes/decisioner');
const projRoutes=require('./routes/project');

mongoose.connect('mongodb://localhost/ceo-davis');
// require('dotenv').config();
// mongoose.connect(process.env.MONGODB_URI);

const app = express();
// app.use(require('stylus').middleware(__dirname + '/public'));  //this is almost certainly wrong
// app.use(stylus);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);

// default value for title local
app.locals.title = 'Decison Tree DaVis';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(layouts); //////////removed by MM

app.use(session({
  secret: 'data visualization is key to your business success',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use((req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUserInfo = req.session.currentUser;
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }

  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/', authRoutes);
app.use('/',adminRoutes);
app.use('/',projRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
