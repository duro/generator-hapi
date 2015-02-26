'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var _  = require('underscore');
var pkg;

var prompts = {
  githubUser      : 'duro',
  appName         : 'whamm-bamm',
  appDescription  : 'Whammmmy',
  author          : 'ZehnerGroup',
  version         : '1.0.0',
  dockerTag       : 'duro/hapi-test',
  appPort         : 8002,
  debugUIPort     : 8082,
  debuggerPort    : 5252,
  useMongo        : true
}

process.env.NODE_ENV = 'test';

describe('hapi:app', function () {
  before(function (done) {
    this.timeout(60000);
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompt(prompts)
      .on('end', done);
  });

  beforeEach(function() {
    pkg = pkg || require(path.join(os.tmpdir(), './temp-test', 'package.json'));
  });

  it('package should have a templates array', function() {
    assert(_.isObject(pkg.templates));
  })

  it('all template destinations should have been created', function () {
    assert.file(_.values(pkg.templates));
  });

  it('all template sources should have been deleted', function () {
    assert.noFile(_.keys(pkg.templates));
  });

  it('package.json should be properly formatted', function () {
    assert.equal(pkg.name, prompts.appName);
    assert.equal(pkg.version, prompts.version);
    assert.equal(pkg.description, prompts.appDescription);
    assert.equal(pkg.author, prompts.author);
  });

});
