var redtape = require('..');

var testCount = 0;
var test = redtape();

test.ignore('this test will not run', function (t) {
  testCount++;
  t.fail('this test should never run');
  t.end();
});

test('this test case will run', function (t) {
  testCount++;
  t.equal(testCount, 1, 'first test case should run');
  t.end();
});

test.ignore('this test will also not run', function (t) {
  testCount++;
  t.fail('this test should also never run');
  t.end();
});

test('this test will also run', function (t) {
  testCount++;
  t.equal(testCount, 2, 'second test case should run');
  t.end();
});
