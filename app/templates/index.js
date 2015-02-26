var Glue = require('glue');
var Manifest = require('./manifest');

var composeOptions = {
    relativeTo: __dirname
};

var Composer = module.exports = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions);

if (!module.parent) {
  Composer(function(err, server) {
    if (err) throw err;
    server.start(function () {
      server.log(['server', 'info'], 'Server started at ' + server.info.uri);
    });
  })
}
