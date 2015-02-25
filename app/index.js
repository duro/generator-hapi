'use strict';
var yeoman    = require('yeoman-generator')
  , chalk     = require('chalk')
  , yosay     = require('yosay')
  , GitHubApi = require('github')
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
    var done = this.async();

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
      default: this._.dasherize(this.appname)
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
    }];

    this.prompt(prompts, function (props) {
      this.githubUser = props.githubUser;
      this.appName = props.appName;
      this.appDescription = props.appDescription;
      this.author = props.author;
      this.version = props.version;

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
        , self = this;
      this.remote('duro', 'hapi-starter', function(err, remote) {
        if (err) throw err;
        remote.directory('.', '.');
        done();
      })
    },

    packageUpdate: function() {
      var appPkg          = this.fs.readJSON(this.destinationPath('package.json'));
      appPkg.name         = this.appName;
      appPkg.description  = this.appDescription;
      appPkg.version      = this.version;
      appPkg.author       = this.author;
      this.fs.write(
        this.destinationPath('package.json'),
        JSON.stringify(appPkg, null, 2)
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
