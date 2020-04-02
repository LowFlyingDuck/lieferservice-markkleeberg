// setup - server
const state = 'development';
const { exec } = require('child_process');
const express = require('express');
const app = express();
const fs = require('fs');
const randomstring = require('randomstring');
const redServer = require('http').createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80);
const server = require('https').createServer({
  key: fs.readFileSync('./privkey.pem','utf-8'),
  cert: fs.readFileSync('./fullchain.pem', 'utf-8')
}, app);
//setup - serverfunctions
const transporter = require('nodemailer').createTransport({
  host: 'smtp.strato.de',
  port: 465,
  secure: true,
  auth: {
    user: 'mail@lieferservice-markkleeberg.de',
    pass: 'mail-arndt32xNX'
  }
});
const email = 'carlinschilling@gmail.com';
const compression = require('compression');
const helmet = require('helmet');
const database = JSON.parse(fs.readFileSync('./database.json'));

// middleware
app.use(compression());
app.use(helmet());
app.use(express.static(__dirname + '/public'));
app.use(express.json());

// routes
app.get('/impressum', (request, response) => {
  response.sendFile(__dirname + '/public/pages/impressum.html');
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
  var search = (request.query.search || '').toLowerCase();
  var filtered = [];
  var output = '';
  for (let product of database.products) {
    if (product.name.toLowerCase().includes(search)) filtered.push(product);
  }
  for (var i = start; i < end && i < filtered.length; i++) output += makeProduct(filtered[i].name, filtered[i].img, filtered[i].prize, filtered[i].comPrize)
  response.setHeader('app-itemcount', filtered.length.toString());
  response.send(output);
})

function makeProduct(name, img, prize, comPrize) {
  var id = randomstring.generate(12);
  var item = `<div class="product" id="${id}">
    <img srcset="${img}" />
    <p class="name">${name}</p>
    <p class="prize">${prize} <span onclick="javascript: entry('${id}','${name}','${img}','${prize}','${comPrize}')">+</span></p>
  </div>`
  return item;
}

app.post('/placeOrder', (request, response) => {
  products = '';
  for (let option of JSON.parse(request.body)) {
    products += `<div><h2>${option.name}</h2><p></p></div>`
  }
  var insertion = '<div><h1>Eine neue Bestellung wurde aufgegeben</h1><p>Bestelldetails</p></div>';
  transporter.sendMail({
    to: 'nils.schwebel.privat@gmail.com',
    from: '"Lieferservice Markkleeberg" <mail@lieferservice-markkleeberg.de',
    html: '<div><h1>Eine neue Bestellung wurde aufgegeben</h1><p>Bestelldetails</p></div>'
  });
})

setInterval(() => exec('sudo certbot renew', (err, stdout) => {
  console.log(stdout);
}), 3600000);

// run
server.listen(443);