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
redtest('options: setup and teardown should get called', function (t, num) {
  t.plan(1);
  t.equals(num, 42);
});

var redtest3 = redtape({ asserts: asserts });
redtest3('options: can pass in custom assertions', function (t) {
  t.plan(2);
  t.like('Eugene', /^eugene$/i);
  t.notlike('Susan', /^eugene$/i);
});

function simpleAfterEach(cb) {
  assert.equal(arguments.length, 1);
  setImmediate(cb);
}

var redtest4 = redtape({ setup: beforeEach, teardown: simpleAfterEach });
redtest4('options: can use a simple after each function with 1 callback',
  function (t) {
    t.end();
  });

var redtest5 = redtape({ beforeEach: beforeEach, afterEach: afterEach });
redtest5('options: beforeEach and afterEach should get called', function (t, num) {
  t.plan(1);
  t.equals(num, 42);
});
