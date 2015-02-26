'use strict';
var yeoman    = require('yeoman-generator')
  , chalk     = require('chalk')
  , yosay     = require('yosay')
  , GitHubApi = require('github')
  , fs        = require('fs')
  , path      = require('path')
  , github;

var githubOptions = {
  version: '3.0.0'
};

github = new GitHubApi(githubOptions);

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async()
      , self = this;

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the fine ' + chalk.red('Hapi') + ' generator!'
    ));

    var prompts = [{
      name: 'githubUser',
      message: 'Would you mind telling me your username on Github?',
      default: 'someuser'
    },{
      name: 'appName',
      message: 'What would you like to call your app?',
      default: function(answers) { return self._.slugify(self.appname) }
    },{
      name: 'appDescription',
      message: 'How would you describe your project?'
    },{
      name: 'author',
      message: 'What author would you like associated with project?',
      default: function(answers) { return answers.githubUser }
    },{
      name: 'version',
      message: 'What is the starting version number you\'d like to use?',
      default: '1.0.0'
    },{
      name: 'nodeVersion',
      message: 'What version of node do you want running on your app Container?',
      default: '0.10.36'
    },{
      name: 'dockerTag',
      message: 'What name would you like to use for your Docker tag?',
      default: function(answers) { return answers.githubUser + '/' + self._.slugify(answers.appName) }
    },{
      name: 'appPort',
      message: 'What port would you like to spin the app up on in your Docker host?',
      default: 8000
    },{
      name: 'debugUIPort',
      message: 'What port would you like to spin the debugger UI up on in your Docker host?',
      default: 8080
    },{
      name: 'debuggerPort',
      message: 'What port would you like to spin the debug listener up on in your Docker host?',
      default: 5858
    },{
      name: 'useMongo',
      type: "confirm",
      message: 'Will this app need a MongoDB instance?'
    },{
      name: 'mongoVersion',
      type: "confirm",
      message: 'Will this app need a MongoDB instance?',
      when: function(answers) { return answers.useMongo },
      default: '2.6.7'
    }];

    this.prompt(prompts, function (props) {
      this.githubUser       = props.githubUser;
      this.appName          = props.appName;
      this.appDescription   = props.appDescription;
      this.author           = props.author;
      this.version          = props.version;
      this.nodeVersion      = props.nodeVersion;
      this.dockerTag        = props.dockerTag;
      this.appPort          = props.appPort;
      this.debugUIPort      = props.debugUIPort;
      this.debuggerPort     = props.debuggerPort;
      this.useMongo         = props.useMongo;
      this.mongoVersion     = props.mongoVersion;

      done();
    }.bind(this));
  },

  configuring: {
    userInfo: function() {
      var done = this.async()
        , self = this;
      github.user.getFrom({ user: this.githubUser }, function (err, res) {
        if (err) throw err;
        self.realName   = res.name;
        self.email      = res.email;
        self.githubUrl  = res.html_url;
        done();
      });
    }
  },

  writing: {
    skeleton: function () {
      var done = this.async()
        , self = this
        , pkg;

      // var ogSourceRoot = this.sourceRoot();
      // this.sourceRoot(path.join(process.env.HOME, 'Workspace', 'projects', 'hapi-vagrant-docker-starter'));
      // this.directory('.', '.');
      // pkg = this.fs.readJSON(this.destinationPath('_package.json'));
      // this._.each(pkg.templates, function(dest, src) {
      //   self.template(src, dest);
      //   self.fs.delete(self.destinationPath(src));
      // });
      // done();

      this.remote('duro', 'hapi-vagrant-docker-starter', 'master', function(err, remote) {
        if (err) throw err;
        remote.directory('.', '.');
        pkg = self.fs.readJSON(self.destinationPath('_package.json'));
        self._.each(pkg.templates, function(dest, src) {
          remote.template(src, dest);
          self.fs.delete(self.destinationPath(src));
        });
        done();
      }, true);
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
