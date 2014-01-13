# redtape

Simple setup/teardowns and assertion extensions for the
[tape](https://github.com/substack/tape) testing framework

[tape](https://github.com/substack/tape) is a very simple, minimalist testing
framework. Sometimes, however, you'd like there to be a little bit more
functionality in the way of setup and teardown functions (or beforeEach and
afterEach functions in BDD speak).

[![build status](https://secure.travis-ci.org/eugeneware/redtape.png)](http://travis-ci.org/eugeneware/redtape)

## Installation

This module is installed via npm, and requires `tape` as a peerDependency:

``` bash
$ npm install tape redtape
```

## Example Usage (options syntax)

There are two ways to use redtape, one uses an options object, while the other
uses function parameters:

### Setup and Teardown (beforeEach, afterEach)

You can pass in an optional beforeEach/afterEach on an options object to the
`redtape` function which will be called before every test:

``` js
var redtape = require('redtape'),
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
```

### Add custom assertions to the `t` object

You can extend the test `t` object by passing through an `asserts` key on
the options object to the `redtape` function with an object that will be
used to extend the built in `t` object:

``` js
var redtape = require('redtape'),
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
```

### Pass variables from beforeEach through to tests and afterEach

If you pass through addition data in the `beforeEach` callback, this data will
get passed as additional parameters to the test, as well as to the `afterEach`
function for cleanup:

``` js
var redtape = require('redtape'),
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
```

## Example Usage (non options syntax)

### Setup and Teardown (beforeEach, afterEach)

You can pass in an optional beforeEach/afterEach to the `redtape` function
which will be called before every test:

``` js
var redtape = require('redtape'),
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
```

### Add custom assertions to the `t` object

You can extend the test `t` object by passing through a third argument to the
`redtape` function with an object that will be used to extend the built in
`t` object:

``` js
var redtape = require('redtape'),
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
```

### Pass variables from beforeEach through to tests and afterEach

If you pass through addition data in the `beforeEach` callback, this data will
get passed as additional parameters to the test, as well as to the `afterEach`
function for cleanup:

``` js
var redtape = require('redtape'),
    level = require('level'),
    rimraf = require('rimraf');

var test = redtape(beforeEach, afterEach);

function beforeEach(cb) {
  rimraf.sync('/tmp/mytestdb');
  // the level callback returns a handle to the open database for it's first
  // non error argument
  level('/tmp/mytestdb', cb);
}

// because the beforeEach function returns a variable, the afterEach function
// will also get a handle to the data so it can clean up.
function afterEach(db, cb) {
  db.close(cb);
}

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
```
