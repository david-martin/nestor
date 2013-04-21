var buster = require('buster'),
  BuildLight = require('../lib/buildlight'),
  _BuildLight = require('buildlight'),
  fs = require('fs');

buster.testCase('buildlight - buildlight', {
  'should set opts via constructor': function () {
    var buildLight = new BuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/' });
    assert.equals(buildLight.opts.scheme, ['red', 'green', 'blue']);
    assert.equals(buildLight.opts.usbled, '/some/usbled/path/');
  },
  'should default opts when unspecified': function () {
    var buildLight = new BuildLight();
    assert.equals(buildLight.opts, {});
  }
});

buster.testCase('buildlight - notify', {
  setUp: function () {
    this.mockFs = this.mock(fs);
    this.stub(process, 'platform', 'linux');
  },
  'should switch all colours off then switch one colour on on build light device based on notification status': function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 1);
    var buildLight = new BuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/' });
    buildLight.notify('OK');
  },
  'should switch all colours on on build light device when notification status is warn': function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 1);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 1);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 1);
    var buildLight = new BuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/' });
    buildLight.notify('WARN');
  },
  'should switch all colours off then switch blue colour on on build light device when status is unknown': function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/red', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/green', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 0);
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/usbled/path/blue', 1);
    var buildLight = new BuildLight({ scheme: ['red', 'green', 'blue'], usbled: '/some/usbled/path/' });
    buildLight.notify('SOMEUNKNOWNSTATUS');
  }
});