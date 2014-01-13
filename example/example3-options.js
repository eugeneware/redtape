var redtape = require('..'),
    level = require('level'),
    rimraf = require('rimraf');

var test = redtape({
  beforeEach: function (cb) {
    rimraf.sync('/tmp/mytestdb');
    // the level callback returns a handle to the open database for it's first
    // non error argument
    level('/tmp/mytestdb', cb);
  },
  // because the beforeEach function returns a variable, the afterEach function
  // will also get a handle to the data so it can clean up.
  afterEach: function (db, cb) {
    db.close(cb);
  }
});

test('I should be able to read a file', function (t, db) {
  t.plan(3);
  db.put('my key', 'my value', function (err) {
    t.error(err);
    db.get('my key', function (err, data) {
      t.error(err);
      t.equal(data, 'my value');
    });
  });
});
