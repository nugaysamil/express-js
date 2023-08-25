const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;


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
app.get('/new-page(.html)?',(req,res) => {
  res.status(400).sendFile(path.join(__dirname,'views','new-page.html'));
}); 

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));






