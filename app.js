const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const OpenAIApi = require('openai');
const openai = new OpenAIApi({
  api_key: process.env.OPENAI_API_KEY
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));

app.get('/', (req, res) => {
  res.render('index');
})

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

// Chat history
const chatHistory = [];

//Makes the API call to OpenAI
app.post('/message', async (req, res) => {

  console.log(process.env.OPENAI_API_KEY);

  try {
      const prompt = req.body;

      //Iterate through the chat history to create the messages array
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      //add the most recent user input to the messages array
      messages.push({"role": "user", "content": prompt})

      //Call the OpenAI API
      const chatCompletion = await openai.createChatCompletion({
          model: "gpt-4o",
          messages: messages,
        });

        //adds the user input and the completion text to the chat history
        chatHistory.push(['user', userInput]);
        chatHistory.push(['assistant', completionText]);

        //returns the completion text to the client
        res.json({
          message : chatCompletion.data.choices[0].message.content,
          role: chatCompletion.data.choices[0].message.role
        });
  } catch (error) {
      console.log("caught error");
      console.log(JSON.stringify(error));
  }

});