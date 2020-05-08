//jshint esversion:8
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/wallDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const postSchema = new mongoose.Schema({
  title: String,
  desc: String
});

const Post = mongoose.model("Post", postSchema);

app.listen(3000, function() {
  console.log("Server Started at port 3000");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/confessions", async(req, res) => {
  const posts = await Post.find();
  res.render('posts',{posts:posts});
});

app.get("/about", function(req, res){
  res.sendFile(__dirname + "/public/about.html");
});

app.post('/', async(req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        desc: req.body.postDesc
    });

    try {
        await post.save();
        posts = await Post.find();
        res.render('posts',{posts:posts});
    } catch (err) {
        res.send(err);
    }
});
