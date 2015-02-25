'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

var prompts = {
  githubUser: 'duro',
  appName: 'hapi-test',
  appDescription: 'This is a test',
  author: 'ZehnerGroup',
  version: '1.0.0'
}

describe('hapi:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompt(prompts)
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([ 'package.json' ]);
  });

  it('package.json should be properly formatted', function () {
    var pkg = require(path.join(os.tmpdir(), './temp-test', 'package.json'));
    assert.equal(pkg.name, prompts.appName);
    assert.equal(pkg.version, prompts.version);
    assert.equal(pkg.description, prompts.appDescription);
    assert.equal(pkg.author, prompts.author);
  });

});
