var test = require('tape');
module.exports = redtape;
function redtape(setup, teardown, asserts) {
  var noop = function (cb) { (typeof cb === 'function') && cb() };
  setup = setup || noop;
  teardown = teardown || noop;
  asserts = asserts || {};
  return function (name, cb) {
    test(name, function (t) {
      var args;
      var _end = t.end;
      t.end = function () {
        var _args = args;
        var _cb = function (err) {
            if (err) throw err;
            _end.call(t);
        };
        if (teardown.length > 1) {
          _args = args.concat(_cb);
        } else {
          _args = [_cb];
        }
        teardown.apply(null, _args);
      };
      Object.keys(asserts).forEach(function (key) {
        if (!(key in t)) {
          t[key] = asserts[key];
        }
      });
      setup(function (err) {
        if (err) throw err;
        args = Array.prototype.slice.call(arguments, 1);
        cb.apply(null, [t].concat(args));
      });
    });
  }
}
