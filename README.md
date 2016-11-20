# query-state [![Build Status](https://travis-ci.org/anvaka/query-state.svg?branch=master)](https://travis-ci.org/anvaka/query-state)

Application state in query string.

![demo](https://raw.githubusercontent.com/anvaka/query-state/master/docs/demo.gif)

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

# license

MIT
