var redtape = require('..'),
    fs = require('fs');

var test = redtape({
  beforeEach: function (cb) {
    fs.writeFile('/tmp/myfile.txt', 'my data', cb);
  },
  afterEach: function (cb) {
    fs.unlink('/tmp/myfile.txt', cb);
  },
  // add the `like` function to the `t` test object
  asserts: {
    like: function (str, reg, msg) {
      this.ok(reg.test(str), msg);
    }
  }
});

test('I should be able to read a file', function (t) {
  t.plan(1);
  fs.readFile('/tmp/myfile.txt', { encoding: 'utf8' }, function (err, data) {
    if (err) return t.error(err);
    t.like(data, /data/);
  });
});
