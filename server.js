const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler');
const {logger} = require('./middleware/logEvents');
const PORT = process.env.PORT || 3500;

// custom middleware
app.use(logger);

// cross origin resource sharing
const whilelist = ['https://www.google.com','http://127.0.0.1:5500','http://localhost:3500'];
const corsOptions = {
  origin: (origin,callback) => {
    if(whilelist.indexOf(origin) !== -1 || !origin) {
      callback(null,true) 
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));



// build-in middleware to handle urlencoded data
// in other word, from data:
// 'content-type: application/x-www.form-urlencoded'

app.use(express.urlencoded({extended: false}))

app.use(express.json());

app.use(express.static(path.join(__dirname,'/public')));

app.get('^/$|/index.(.html)?',(req,res) => {
  res.sendFile('./views/index.html',{root:__dirname});
});

app.get('/new-page(.html)?',(req,res) => {
  res.sendFile(path.join(__dirname,'views','new-page.html'));
}); 

app.get('/old-page(.html)?',(req,res) => {
  res.redirect(301,'/new-page.html'); // 302 by default
}); 

//Route handlers

app.get('/hello(.html)?',(req,res,next) => {
  console.log('attempted to load hello.html');
  next();
},(req,res) => {
  res.send('Hello World!');
}); 

const one = (req,res,next) => {
  console.log('one');
  next();
}

const two = (req,res,next) => {
  console.log('two');
  next();
}

const three = (req,res) => {
  console.log('three');
  res.send('Finished!')
}

app.get('/chain(.html)?', [one,two,three])

app.all('*',(req,res) => {
  res.status(404);
  if(req.accepts('html')) {
    res.sendFile(path.join(__dirname,'views','404.html'));
    
  }
  else if(req.accepts('html')) {
    res.json({error: '404 Not found'})
  } else {
    res.type('txt').send('404 Not found')
  }
}); 

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
