# query-state [![Build Status](https://travis-ci.org/anvaka/query-state.svg?branch=master)](https://travis-ci.org/anvaka/query-state)

Application state in query string.

![demo](https://raw.githubusercontent.com/anvaka/query-state/master/docs/demo.gif)

https://anvaka.github.io/query-state/#?name=world

# usage

Grab it from npm and use with your favorite bundler:

```
npm install query-state --save
```

Or download from CDN:

```
<script src='https://cdn.rawgit.com/anvaka/query-state/v1.0.0/dist/query-state.min.js'>
</script>
```

If you downloaded from CDN the library will be available under `queryState` global name.

``` js
// create a new query state instance
var qs = queryState();

// get current application state from the hash string:
var appState = qs.get();

// you can also monitor for changes in the query string:
qs.onChange(function(appState) {
  // prints new application state on each hash update
  console.log('app state changed!', appState);
});

// If you want to set a new value in the app state:
qs.set('answer', 42);

// Now the query string will have `answer=42` part in it.
console.log(window.location.hash.indexOf('answer=42')) // prints value > 0.
```

## defaults

If you want to initialize app state with default values, you can pass them into
query state function:

``` js
// this will set query string to `answer=42`, unless it already has key called
// "answer". In which case query string's value will take precedence.
var qs = queryState({
  answer: 42
});
```

## type limitations

This is a very simple module that currently does not support nested objects.
I.e. you cannot set application state to `{foo: {bar: 42}}`. If you need this
behavior, most likely this module is not for you.

We do support primitive types serialization/deserialization:

* Numbers
* Dates
* Strings

## clean up

Normally your app state will live as long as your application. However if you
do need to clean up resources (e.g. unloading your app). you can call `qs.dispose()`

``` js
var qs = querySate();

// use it...

// and clean up when you need it:
qs.dispose();
```

# license

MIT
