if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const Cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth')

var app = express();


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
const db = mongoose.connection;
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected mongoose successfuly'))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(Cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);




app.listen(process.env.PORT || 5000)
module.exports = app;
