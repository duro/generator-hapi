var Confidence = require('confidence');

var criteria = {
    env: process.env.NODE_ENV
};

var config = {

  $meta: 'Our main Application config',

  pkg: require('./package.json'),

  server : {
    port : '<%= appPort %>',
    host : '0.0.0.0'
  },

  api: {
    basepath: 'http://docker.local:<%= appPort %>',
    title: '<%= _.slugify(appName) %>',
    description: '<%= appDescription %>'
  },

  security: {
    jwtSecret: 'please-replace-this-with-a-secret'
  },

  logging : {
    enabled: {
      $filter: 'env',
      test: false,
      $default: true
    },
    reporters : [{
      reporter: require('good-console'),
      args:[{ log: '*', response: '*' }]
    }]
  },

  <% if(useMongo) { %>
  database: {
    mongodb: {
      database: {
        $filter: 'env',
        test: '<%= _.slugify(appName) %>-test',
        $default: '<%= _.slugify(appName) %>'
      },
      hosts: [
        {
          host: process.env.MONGODB_PORT_27017_TCP_ADDR,
          port: process.env.MONGODB_PORT_27017_TCP_PORT,
        }
      ]
    }
  },
  <% } %>

}

var store = new Confidence.Store(config);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};