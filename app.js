require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster76232.ammm8wy.mongodb.net/wikiDB`);

// Create schema
const postSchema = { title: String, content: String };
// Create model
const Article = mongoose.model('Article', postSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.post(`/articles`, (req, res) => {
    const newArticle = new BlogPost({ title: req.body.title, content: req.body.content });
    newArticle.save();
    res.redirect('/articles');
})

app.get(`/articles`, (req, res) => {
    if (req.originalUrl.includes('favicon.ico')) {
      res.status(204).end()
    } else {
      Article.find({}, function(err,items) {
        if (err) { res.send(err) }
        else {
            res.send(items);
        }   
    });  }
})

app.listen(3000, function(req) {
    console.log("Server started on port 3000");
});
  