const express     = require('express');
const bodyParser  = require('body-parser');
const Post        = require('./models/post');
const mongoose    = require('mongoose');

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

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// create post
app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title:    req.body.title,
    content:  req.body.content
  });
  post.save().then(post => {
    res.status(201).json({
      message: 'Success',
      postId: post._id
    });
  });

});

// getting posts
app.get('/api/posts', (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Success",
      posts: documents
    });
  })
});


// delete post

app.delete('/api/posts/:id', (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log("Deleted Post id: " + req.params.id);
    res.status(200).json({
      message: 'Post deleted'
    });
  })
});


module.exports = app;
