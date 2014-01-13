var tape = require('tape'),
    assert = require('assert'),
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

var redtest = redtape(beforeEach, afterEach, asserts);
redtest('beforeEach and afterEach should get called', function (t, num) {
  t.plan(1);
  t.equals(num, 42);
  t.end();
});

var redtest2 = redtape();
redtest2('all args are optional', function (t) {
  t.plan(1);
  t.equal(arguments.length, 1);
  t.end();
});

var redtest3 = redtape(null, null, asserts);
redtest3('can pass in custom assertions', function (t) {
  t.plan(2);
  t.like('Eugene', /^eugene$/i);
  t.notlike('Susan', /^eugene$/i);
  t.end();
});
