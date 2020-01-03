var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyparser = require('body-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var session = require('express-session');
var mongoose = require('mongoose');
var validator = require('express-validator');
var config = require('./config');
var redis = require('redis');
var fetch = require('node-fetch')
var RedisStore = require('connect-redis')(session)
var flash = require('flash')
var chalk = require('chalk')
var flash = require('req-flash')

var indexRouter = require('./routes/index');
var device = require('./routes/device');
var register = require('./routes/register');
var login = require('./routes/login');
var auth = require('./routes/auth');
var dashboard = require('./routes/dashboard2');
var devlist = require('./routes/devlist2');
var create = require('./routes/create');
var del = require('./routes/delete');
var notif = require('./routes/notif');
var activate = require('./routes/activate');
var app = express();

// var client = redis.createClient();
var redisClient = redis.createClient(config.redis.port, config.redis.host)
redisClient.on('connect', () => {
  console.log(chalk.green('Connected To Redis'))
})
redisClient.on('error', (err) => {
  console.log(chalk.red('Redis Error: ' + err))
})

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
var helpers = require('./views/helpers')

hbs = hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  helpers: helpers.helpers,
  layoutsDir: path.join(__dirname, '/views/layouts/'),
  partialsDir: path.join(__dirname, '/views/partials/')
});


helpers.register(hbs)
app.engine('hbs', hbs)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')


app.use(cookieParser());
app.use(session({
  store: new RedisStore({
    // host: 'localhost',
    // port: 6379,
    client: redisClient,
    // ttl: 86400
  }),
  // name: 'redisA',
  secret: 'trackers',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}))
app.use(flash());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.locals.success = req.flash('success');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use(logger('dev'));
// app.use(flash());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: false
}));


//app.use(cors())


// app.use(validator());
app.use('/', indexRouter);
app.use('/device', device);
app.use('/create', create);
// app.use('/auth', require('./routes/auth'));
app.use('/login', login);
app.use('/register', register);
app.use('/dashboard', dashboard);
app.use('/devlist', devlist);
app.use('/logout', auth);
app.use('/delete', del);
app.use('/notif', notif);
app.use('/activate', activate);


app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb://localhost:27017/tracker')
mongoose.connection.on('connected', () => {
  console.log(chalk.green('Connected to Mongo'))
})
mongoose.connection.on('error', (err) => {
  console.log(chalk.red('Mongo error: ' + err))
})
mongoose.connection.on('disconnected', () => {
  console.log(chalk.yellow('Mongo disconnected'))
})



//use sessions for tracking logins
// let client = redis.createClient()








// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
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