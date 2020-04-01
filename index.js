// setup - server
const express = require('express');
const app = express();
const fs = require('fs');
const redServer = require('http').createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80);
const server = require('https').createServer({
  key: fs.readFileSync('./privkey.pem','utf-8'),
  cert: fs.readFileSync('./fullchain.pem', 'utf-8')
}, app);
//setup - serverfunctions
const compression = require('compression');
const helmet = require('helmet');
const database = JSON.parse(fs.readFileSync('./database.json'));

// middleware
app.use(compression());
app.use(helmet());
app.use(express.static(__dirname + '/public'));

// routes
app.get('/impressum', (request, response) => {
  response.sendFile('pubic/pages/impressum.html');
})

app.get('/retrieveCount', (request, response) => {
  response.send(database.products.length.toString());
})

app.get('/retrieveDatabase', (request, response) => {
  response.send(JSON.stringify(database));
})

app.get('/retrieveProducts', (request, response) => {
  var start = parseInt(request.query.start);
  var end = parseInt(request.query.end);
  var output = '';
  for (var i = start; i < end && i < database.products.length; i++) {
    var path = database.products[i];
    output += makeProduct(path.name, path.img, path.prize, path.comPrize);
  }
  response.send(output);
})

function makeProduct(name, img, prize, comPrize) {
  var item = `<div class="product" prize="${prize}" comPrize="${comPrize}">
    <img srcset="${img}" />
    <p class="name">${name}</p>
    <p class="prize">${prize}</p>
  </div>`
  return item;
}

// run
server.listen(443);
