var fs = require('fs');
var pdf = require('html-pdf');
var options = { format: 'Letter' };
var html = '<!DOCTYPE html><html><head><base href=\"http://0.0.0.0:3002\"><link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css\"><link rel=\"stylesheet\" href=\"/online-pleas/static/vendor/bootstrap/dist/css/bootstrap.min.css\"><link rel=\"stylesheet\" href=\"/online-pleas/static/vendor/bootstrap-additions/dist/bootstrap-additions.min.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/online-pleas/static/less/plea.css\"></head><body><header><div class=\"container\"><h1>NJC - Online plea</h1><h4>Plea for offence </h4><!--h5 Submitted - date submitted--></div></header><main><div class=\"container\"><hr><hr></div></main><footer><div class=\"container\"><p>Neighbourhood Justice Centre</p></div></footer></body></html>';

pdf.create(html, options).toFile('./uploads/test.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/app/businesscard.pdf' }
});
