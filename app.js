require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
app.set('view engine', 'ejs');
const _ = require('lodash');

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster76232.ammm8wy.mongodb.net/wikiDB`);

// Create schema
const postSchema = { title: String, content: String };
// Create model
const Article = mongoose.model('Article', postSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Requests targeting all articles

app.route('/articles')
  .post((req, res) => {
    const newArticle = new Article({ title: req.body.title, content: req.body.content });
    newArticle.save();
    res.redirect('/articles');
})
  .get((req, res) => {
    if (req.originalUrl.includes('favicon.ico')) {
      res.status(204).end()
    } else {
      Article.find({}, function(err,items) {
        if (err) { res.send('No such articles found :(') }
        else {
            res.send(items);
        }   
    });  }
})
  .delete((req, res) => {
    if (req.originalUrl.includes('favicon.ico')) {
      res.status(204).end()
    } else {
      Article.deleteMany({}, function(err) {
        res.send("We've deleted everything hahah!")
      });   
    }
})

// Requests targeting a specific article

app.route('/articles/:articleName')
.get((req, res) => {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  } else {
    Article.findOne({title: req.params.articleName}, function(err,item) {
      if (err) { res.send('No such articles found :(') }
      else {
          res.send(item);
      }   
  });  }
})
.put((req, res) => {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  } else {
    // Без overwrite: true будет вести себя как patch
    Article.findOneAndUpdate({title: req.params.articleName}, { title: req.body.title, content: req.body.content }, {overwrite: true}, function(err,item) {
      if (err) { res.send('Could not update an article :(') }
      else {
          res.send(item);
      }   
  });  }
})
.patch((req, res) => {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  } else {
    Article.findOneAndUpdate({title: req.params.articleName}, { title: req.body.title, content: req.body.content }, function(err,item) {
      if (err) { res.send('Could not update an article :(') }
      else {
          res.send(item);
      }   
  });  }
})
.delete((req, res) => {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  } else {
    Article.deleteOne({title: req.params.articleName}, function(err) {
      res.send(`Article ${req.params.articleName} deleted.`)
    });   
  }
})


app.listen(3000, function(req) {
    console.log("Server started on port 3000");
});
  