
exports.register = function(server, options, next) {

  // Add the route
  server.route({
      method: 'GET',
      path:'/hello',
      handler: function (request, reply) {
        reply('hello world ' + process.env.HOSTNAME);
      }
  });

  next();

}

exports.register.attributes = {
  name: 'hello',
  version: '1.0.0'
}
