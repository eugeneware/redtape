var redtape = require('..'),
    fs = require('fs');

var test = redtape(beforeEach, afterEach);

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
    t.equal(data, 'my data');
  });
});
