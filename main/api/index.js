var express = require('express');
var fs = require('fs');
var app = express();
var https = require('https');

app.use('/', function (req, res) {
  console.dir (req.client);
  if (req.client.authorized) {
        res.status(200).send({ 'status': 'approved' });
    } else {
        res.status(200).send('<form action="/" method="post" enctype="multipart/form-data"><p><keygen name="key"></p><p><input type=submit value="Submit key..."></p></form>');
    }
});

var options = {
  key: fs.readFileSync(__dirname + './../../config/ssl/afrgree.key.pem'),
  cert: fs.readFileSync(__dirname + './../../config/ssl/afrgree.cert.pem'),
  requestCert: true,
  rejectUnauthorized: false
};

var secureServer = https.createServer(options, app).listen('3030', function () {
  console.log("Secure server listening on port 3030");
});

