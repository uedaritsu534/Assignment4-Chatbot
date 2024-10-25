const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { chatWithOpenAI, appendInitial } = require('./chatbot.js');
const { newChat, getChats, postChats, closeMongo } = require('./mongo.js');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const id = await newChat();
  res.redirect(`/chats/${id}/`);
});

app.get('/chats/:chatId', async (req, res) => {
  const partialChats = await getChats(req.params.chatId);
  const chats = appendInitial(partialChats);
  res.render('index', { chats });
});

app.post('/chats/:chatId/message', async (req, res) => {
  const chats = await getChats(req.params.chatId);
  const response = await chatWithOpenAI([...chats, { role: 'user', content: req.body.message}]);
  await postChats(req.params.chatId, req.body.message, response)
  res.redirect(`/chats/${req.params.chatId}/`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));

process.on('SIGTERM', async () => {
  console.info('SIGTERM signal received.');

  console.log('Closing mongodb connection...');
  await closeMongo();
  console.log('Mongodb connection closed.');

  console.log('Closing http server...');
  server.close((err) => {
    console.log('Http server closed.');
    process.exit(err ? 1 : 0);
  });
});