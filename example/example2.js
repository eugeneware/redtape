var redtape = require('..'),
    fs = require('fs');

// add the `like` function to the `t` test object
var assertions = {
  like: function (str, reg, msg) {
    this.ok(reg.test(str), msg);
  }
};

var test = redtape(beforeEach, afterEach, assertions);

function beforeEach(cb) {
  fs.writeFile('/tmp/myfile.txt', 'my data', cb);
}

function afterEach(cb) {
  fs.unlink('/tmp/myfile.txt', cb);
}

test('I should be able to read a file', function (t) {
  t.plan(1);
  fs.readFile('/tmp/myfile.txt', { encoding: 'utf8' }, function (err, data) {
    if (err) return t.error(err);
    t.like(data, /data/);
  });
});
