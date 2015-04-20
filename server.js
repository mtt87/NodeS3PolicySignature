var express = require('express');
var app = express();
var crypto = require('crypto');
var cors = require('cors');
var awsConfig = require('./awsConfig.json');

app.use(cors());

app.get('/policy', function(req, res, next) {


  var expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);

  var data = {
    expiration: expiration.toISOString(),
    conditions: [{
        bucket: awsConfig.bucket
      },
      ["starts-with", "$key", ""], {
        acl: "public-read"
      }, {
        "success_action_status": "201"
      },
      ["starts-with", "$Content-Type", ""],
      ["content-length-range", 0, 15728640] // Max file size 15MB
    ]
  };

  var policy = new Buffer(JSON.stringify(data)).toString('base64').replace(/\n|\r/, '');
  var hmac = crypto.createHmac('sha1', awsConfig.secret);
  var hash = hmac.update(policy);
  var signature = hmac.digest('base64');


  res.header('Content-Type', 'application/json')
    .send({
      'AWSAccessKeyId': awsConfig.key,
      'policy': policy,
      'signature': signature
    });
});

var server = app.listen(3000);
