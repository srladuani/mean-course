const express = require("express");
const Post    = require('../models/post');
const multer  = require("multer");

const router  = express.Router();

const MIME_TYPE_MAP = {
  'image/png':  'png',
  'image/jpeg': 'jpg',
  'image/jpg':  'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error     = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    callback(error, "backend/images")
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext  = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + "." + ext);
  }
});

// create post
router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
  const url  = `${req.protocol}://${req.get('host')}`
  const post = new Post({
    title:      req.body.title,
    content:    req.body.content,
    imagePath:  `${url}/images/${req.file.filename}`
  });
  post.save().then(post => {
    res.status(201).json({
      message: 'Success',
      post: {
        ...post,
        id: post._id
      }
    });
  });

});

// update post
router.put(
  "/:id",
  multer({storage: storage}).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url  = `${req.protocol}://${req.get('host')}`;
      imagePath  = `${url}/images/${req.file.filename}`;
    }
    const post  = new Post({
      _id:  req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    Post.updateOne({_id: req.params.id}, post)
      .then(result => {
        res.status(200).json({
          message: "Updated successfull!"
        });
      });
});

// getting posts
router.get('', (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Success",
      posts: documents
    });
  })
});

// get post
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else{
      res.status(404).json({message: "Post not found!"});
    }
  });
});


// delete post
router.delete('/:id', (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log("Deleted Post id: " + req.params.id);
    res.status(200).json({
      message: 'Post deleted'
    });
  })
});


module.exports = router;
