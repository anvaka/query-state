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

test('it can unsubscribe from events', function(t) {
  var queryState = makeQueryState();

  queryState.onChange(fail);
  queryState.offChange(fail);

  queryState.set('foo', 'bar');

  // end test a little later
  setTimeout(function() { t.end(); }, 30);

  function fail() { t.fail('this should never be called'); }
});

test('it can pass the context', function(t) {
  var queryState = makeQueryState();
  var ctx = {};

  queryState.onChange(checkContext, ctx);
  queryState.set('foo', 'bar');

  function checkContext() {
    t.ok(ctx === this, 'context is set correctly');
    t.end();
  }
});

test('it can dispose', function(t) {
  var queryState = makeQueryState();
  queryState.onChange(fail);
  queryState.dispose();

  queryState.set('foo', 'bar');

  // end test a little later
  setTimeout(function() { t.end(); }, 30);

  function fail() { t.fail('this should never be called'); }
});

test('it can init default state', function(t) {
  var defaults = {
    foo: 'bar'
  };
  var queryState = makeQueryState(defaults);

  var initializedState = queryState.get();
  t.equals(Object.keys(initializedState).length, 1, 'state has just one key');
  t.equals(initializedState.foo, defaults.foo, 'and it is the same as defaults');

  t.end();
});
