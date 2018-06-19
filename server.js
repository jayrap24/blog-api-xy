const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();



// log the http layer***

app.use(morgan('common'));


// start by creating a list

BlogPosts.create('parts unkown', 'food show', 'anthony bourdai', 2014);


// GET rest api
app.get('/blog-posts', (req,res)=>{
    res.json(BlogPosts.get());
    console.log("app is starting now bro");
});


// POST
app.post('/blog-posts', jsonParser, (req, res)=>{
   const requiredFields = ['title', 'content', 'author'];
   for(let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
             const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).end();
        }
    }
    const infoBook = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    
    res.status(201).json(infoBook);
});


//PUT
app.put('/blog-posts/:id', jsonParser, (req, res)=>{
   const requiredFields = ['title', 'content', 'author'];
   for(let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            console.log("fill in title, content, and author");
            return res.status(400);
        }
    }
    // match the id
    if(req.params.id !== req.body.id){
        
        return res.status(400);
    }
    
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).end();
    
});

//DELETE
app.delete('/blog-posts/:id', (req,res)=>{
    BlogPosts.delete(req.params.id);
    res.status(204).end();
});



let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err);
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};








