var query = require('../lib/query.js');
var test = require('tap').test;

test('it can store and restore objects', function(t) {
  var testObject = {
    answer: 42,
    floatNumber: 42.42,
    booleanSupported: true,
    dateValue: new Date(),
    question: 'what is the answer to life the universe and everything?'
  };

  var string = query.stringify(testObject);
  var restored = query.parse(string);

  t.equals(restored.answer, testObject.answer, 'integer value restored');
  t.equals(restored.floatNumber, testObject.floatNumber, 'float value restored');
  t.equals(restored.booleanSupported, testObject.booleanSupported, 'boolean value restored');
  t.type(restored.dateValue, 'Date', 'restored date has Date type');
  t.equals(restored.dateValue.getTime(), testObject.dateValue.getTime(), 'date value restored');
  t.equals(restored.question, testObject.question, 'string value restored');

  t.end();
});

test('it can handle nulls', function(t) {
  var emptyQuery = query.stringify(null);
  var restored = query.parse(emptyQuery);

  t.equals(emptyQuery, '', 'null objects are empty strings');
  t.equals(Object.keys(restored).length, 0, 'restored object has no keys')
  t.end();
});

test('it can handle special symbols', function(t) {
  var inputCode = 'Hello (:)';

  var input = query.stringify({code: inputCode});

  var restored = query.parse(input);

  t.equals(input.indexOf('('), -1, '`(` is encoded');
  t.equals(input.indexOf(')'), -1, '`)` is encoded');
  t.equals(restored.code, inputCode, 'string is restored');
  t.end();
});


test('it can handle empty strings', function(t) {
  var restored = query.parse('foo=');
  t.equals(restored.foo, '', 'foo value is set correctly');

  t.end();
});
