var redtape = require('../..');

var testCount = 0;
var test = redtape();

test('this test will not run', function (t) {
  testCount++;
  t.fail('this test should never run');
  t.end();
});

test.only('only run this test case', function (t) {
  testCount++;
  t.equal(testCount, 1, 'only test should be run');
  t.end();
});

test('this test will also not run', function (t) {
  testCount++;
  t.fail('this test should also never run');
  t.end();
});
