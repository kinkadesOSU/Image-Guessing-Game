const express = require("express");
const app = express();
app.set('port', process.argv[2]);

app.use(express.json())
app.use(express.static(__dirname + '/public'));

// app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile('./views/index.html', { root: __dirname })
});

app.get('/eight', (req, res) => {
    res.sendFile('./views/eight.html', { root: __dirname })
});

app.get('/twelve', (req, res) => {
    res.sendFile('./views/twelve.html', { root: __dirname })
});

app.get('/sixteen', (req, res) => {
    res.sendFile('./views/sixteen.html', { root: __dirname })
});

// error routes
app.use(function(req,res){
    res.status(404);
    // res.render('404');
  });
  
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    // res.render('500');
  });

// listen on port specified with node index.js XXXX
app.listen(app.get('port'), () => {
    console.log(`Express started on port ${app.get('port')}`);
});
