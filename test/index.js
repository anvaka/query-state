var makeQueryState = require('../');
var test = require('tap').test;

test('it can set app state', function(t) {
  var queryState = makeQueryState();

  queryState.set('foo', 'bar');
  var fooValue = queryState.get('foo')
  t.equal(fooValue, 'bar', 'foo value is set correctly');

  queryState.set('another', '42');
  var anotherValue = queryState.get('another')
  t.equal(anotherValue, '42', 'another value is set correctly');

  var appState = queryState.get();
  t.same(appState, {
    foo: 'bar',
    another: '42'
  }, 'the entire state is correct')

  t.end();
});

test('it monitors events', function(t) {
  var queryState = makeQueryState();

  queryState.onChange(function(newState) {
    t.same(newState, {
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
  t.equal(Object.keys(initializedState).length, 1, 'state has just one key');
  t.equal(initializedState.foo, defaults.foo, 'and it is the same as defaults');

  t.end();
});

test('it can set properties if they are empty', function(t) {
  var original = {
    foo: 'bar'
  };
  var queryState = makeQueryState(original);

  var moreProperties = {
    foo: 'baz',
    answer: 42
  };

  queryState.setIfEmpty(moreProperties);

  var appState = queryState.get()
  t.equal(appState.foo, 'bar', 'foo was not updated as it is not empty')
  t.equal(appState.answer, 42, 'answer was added')

  t.end();
});

test('it can chain calls', function(t) {
  var qs = makeQueryState();
  qs.set('name', 'Haddaway').set('song', 'What is love?');

  t.equal(qs.get('name'), 'Haddaway', 'name is set');
  t.equal(qs.get('song'), 'What is love?', 'song is set');

  t.end();
});

test('it updates query when change fires', function(t) {
  var qs = makeQueryState();
  var history = qs.getHistoryObject();
  history.set({
    foo: 42
  });

  qs.onChange(function() {
    t.equal(qs.get('foo'), 42, 'query state is updated from history');
    t.end();
  });
})

test('it can create singleton', function(t) {
  var qsA = makeQueryState.instance({age: 42});
  var qsB = makeQueryState.instance({age: 100, height: 180});
  t.ok(qsA === qsB, 'they are the same')

  t.equal(qsA.get('age'), 42, 'age is set to 42');
  t.equal(qsA.get('height'), 180, 'height is 180');
  t.end();
});
