var makeQueryState = require('../');
var test = require('tap').test;

test('it can set app state', function(t) {
  var queryState = makeQueryState();

  queryState.set('foo', 'bar');
  var fooValue = queryState.get('foo')
  t.equals(fooValue, 'bar', 'foo value is set correctly');

  queryState.set('another', '42');
  var anotherValue = queryState.get('another')
  t.equals(anotherValue, '42', 'another value is set correctl');

  var appState = queryState.get();
  t.deepEquals(appState, {
    foo: 'bar',
    another: '42'
  }, 'the entire state is correct')

  t.end();
});

test('it monitors events', function(t) {
  var queryState = makeQueryState();

  queryState.onChange(function(newState) {
    t.deepEquals(newState, {
      foo: 'bar'
    }, 'query state changed');

    t.end();
  });

  queryState.set('foo', 'bar');
});
