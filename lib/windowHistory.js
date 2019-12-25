/**
 * Uses `window` to monitor hash and update hash
 */
module.exports = windowHistory;

var inMemoryHistory = require('./inMemoryHistory.js');
var query = require('./query.js');

function windowHistory(defaults, options) {
  // If we don't support window, we are probably running in node. Just return
  // in memory history
  if (typeof window === 'undefined') return inMemoryHistory(defaults);

  // Store all `onChanged()` listeners here, so that we can have just one
  // `hashchange` listener, and notify one listeners within single event.
  var listeners = [];

  var useSearchPart = options && options.useSearch; // prefer query ? over hash #

  // This prefix is used for all query strings. So our state is stored as
  // my-app.com/#?key=value
  var hashPrefix = useSearchPart ? '?' : '#?';

  if (options.rewriteHashToSearch) {
    rewriteHashToSearch();
  }
  init();

  // This is our public API:
  return {
    /**
     * Adds callback that is called when hash change happen. Callback receives
     * current hash string with `#?` sign
     * 
     * @param {Function} changeCallback - a function that is called when hash is
     * changed. Callback gets one argument that represents the new state.
     */
    onChanged: onChanged,

    /**
     * Releases all resources
     */
    dispose: dispose,

    /**
     * Sets a new app state
     *
     * @param {object} appState - the new application state, that should be
     * persisted in the hash string
     */
    set: set,

    /**
     * Gets current app state
     */
    get: getStateFromHash,

    /**
     * Allows to rewrite current hash url into search url
     */
    rewriteHashToSearch: rewriteHashToSearch
  };

  // Public API is over. You can ignore this part.

  function init() {
    var stateFromHash = getStateFromHash();
    var stateChanged = false;

    if (typeof defaults === 'object' && defaults) {
      Object.keys(defaults).forEach(function(key) {
        if (key in stateFromHash) return;

        stateFromHash[key] = defaults[key]
        stateChanged = true;
      });
    }

    if (stateChanged) set(stateFromHash);
  }

  function rewriteHashToSearch() {
    var mergedState = Object.create(null);

    var searchString = window.location.search;
    if (searchString) mergedState = Object.assign(mergedState, query.parse(searchString.substr(1)));

    var hashString = window.location.hash;
    if (hashString) mergedState = Object.assign(mergedState, query.parse(hashString.substr(2)));

    set(mergedState);
  }

  function set(appState) {
    var hash = hashPrefix + query.stringify(appState);
    if (useSearchPart && window.location.hash) {
      // preserve hash if it was there.
      hash += window.location.hash;
    }

    if (window.history) {
      window.history.replaceState(undefined, undefined, hash);
    } else {
      window.location.replace(hash);
    }
  }

  function onChanged(changeCallback) {
    if (typeof changeCallback !== 'function') throw new Error('changeCallback needs to be a function');

    // we start listen just once, only if we didn't listen before:
    if (listeners.length === 0) {
      window.addEventListener('hashchange', onHashChanged, false);
    }

    listeners.push(changeCallback);
  }

  function dispose() {
    if (listeners.length === 0) return; // no need to do anything.

    // Let garbage collector collect all listeners;
    listeners = [];

    // And release hash change event:
    window.removeEventListener('hashchange', onHashChanged, false);
  }

  function onHashChanged() {
    var appState = getStateFromHash();
    notifyListeners(appState);
  }

  function notifyListeners(appState) {
    for (var i = 0; i < listeners.length; ++i) {
      var listener = listeners[i];
      listener(appState);
    }
  }

  function getStateFromHash() {
    var baseString = useSearchPart ? window.location.search : window.location.hash;
    // or symbol || is used to get empty string when no base string is present. 
    var queryString = (baseString || hashPrefix).substr(hashPrefix.length);
    return query.parse(queryString);
  }
}
