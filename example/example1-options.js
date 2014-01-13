var redtape = require('..'),
    fs = require('fs');

var test = redtape({
  beforeEach: function (cb) {
    fs.writeFile('/tmp/myfile.txt', 'my data', cb);
  },
  afterEach: function (cb) {
    fs.unlink('/tmp/myfile.txt', cb);
  }
});

test('I should be able to read a file', function (t) {
  t.plan(1);
  fs.readFile('/tmp/myfile.txt', { encoding: 'utf8' }, function (err, data) {
    if (err) return t.error(err);
    t.equal(data, 'my data');
  });
});

// You can also pass the test plan assertion in as the second argument
// ie. This is equivalent to the test above
test('I should be able to read a file', 1, function (t) {
  fs.readFile('/tmp/myfile.txt', { encoding: 'utf8' }, function (err, data) {
    if (err) return t.error(err);
    t.equal(data, 'my data');
  });
});
