const path        = require('path');
const express     = require('express');
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');

const postsRouter = require('./routes/posts');

const app = express();

// 'mongodb://' + username + ':' + dbPassword + '@' + host + ':' + port + '/' + database;
mongoose.connect("mongodb://127.0.0.1:27017/mean_course")
  .then(() => {
    console.log('connected to database');
  })
  .catch(() => {
    console.log('connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use("/api/posts", postsRouter);
module.exports = app;
