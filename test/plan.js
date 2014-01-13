var assert = require('assert'),
    redtape = require('..'),
    setImmediate = global.setImmediate || process.nextTick;

function beforeEach(cb) {
  setImmediate(function () {
    cb(null, 42);
  });
}

function afterEach(num, cb) {
  setImmediate(function () {
    assert.equal(num, 42);
    cb();
  });
}

var asserts = {
  like: function (str, reg, msg) {
    this.ok(reg.test(str), msg);
  },
  notlike: function (str, reg, msg) {
    this.ok(!reg.test(str), msg);
  }
};

var redtest = redtape({ setup: beforeEach, teardown: afterEach });
redtest('plan: should support plan execution syntax', 3, function (t, num) {
  t.equals(num, 42);
  t.equals(true, true);
  t.equals('hello', 'hello');
});
