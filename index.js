/**
 * Allows application to access and update current app state via query string
 */
module.exports = queryState;

var eventify = require('ngraph.events');
var windowHistory = require('./lib/windowHistory.js');

/**
 * Just a convenience function that returns singleton instance of a query state
 */
queryState.instance = instance;

// this variable holds singleton instance of the query state
var singletonQS;

/**
 * Creates new instance of the query state.
 */
function queryState(defaults, options) {
  options = options || {};
  var history = options.history || windowHistory(defaults, options);
  validateHistoryAPI(history);

  history.onChanged(updateQuery)

  var query = history.get() || Object.create(null);

  var api = {

    /**
     * Gets current state.
     *
     * @param {string?} keyName if present then value for this key is returned.
     * Otherwise the entire app state is returned.
     */
    get: getValue,

    /**
     * Merges current app state with new key/value.
     *
     * @param {string} key name
     * @param {string|number|date} value
     */
    set: setValue,

    /**
     * Removes value from the query string
     */
    unset: unsetValue,

    /**
     * Similar to `set()`, but only sets value if it was not set before.
     *
     * @param {string} key name
     * @param {string|number|date} value
     */
    setIfEmpty: setIfEmpty,

    /**
     * Releases all resources acquired by query state. After calling this method
     * no hash monitoring will happen and no more events will be fired.
     */
    dispose: dispose,

    onChange: onChange,
    offChange: offChange,

    getHistoryObject: getHistoryObject,
  }

  var eventBus = eventify({});

  return api;

  function onChange(callback, ctx) {
    eventBus.on('change', callback, ctx);
  }

  function offChange(callback, ctx) {
    eventBus.off('change', callback, ctx)
  }

  function getHistoryObject() {
    return history;
  }

  function dispose() {
    // dispose all history listeners
    history.dispose();

    // And remove our own listeners
    eventBus.off();
  }

  function getValue(keyName) {
    if (keyName === undefined) return query;

    return query[keyName];
  }

  function setValue(keyName, value) {
    var keyNameType = typeof keyName;

    if (keyNameType === 'object') {
      Object.keys(keyName).forEach(function(key) {
        query[key] = keyName[key];
      });
    } else if (keyNameType === 'string') {
      query[keyName] = value;
    }

    history.set(query);

    return api;
  }

  function unsetValue(keyName) {
    if (!(keyName in query)) return; // nothing to do

    delete query[keyName];
    history.set(query);

    return api;
  }

  function updateQuery(newAppState) {
    query = newAppState;
    eventBus.fire('change', query);
  }

  function setIfEmpty(keyName, value) {
    if (typeof keyName === 'object') {
      Object.keys(keyName).forEach(function(key) {
        // TODO: Can I remove code duplication? The main reason why I don't
        // want recursion here is to avoid spamming `history.set()`
        if (key in query) return; // key name is not empty

        query[key] = keyName[key];
      });
    }

    if (keyName in query) return; // key name is not empty
    query[keyName] = value;

    history.set(query);

    return api;
  }
}

/**
 * Returns singleton instance of the query state.
 *
 * @param {Object} defaults - if present, then it is passed to the current instance
 * of the query state. Defaults are applied only if they were not present before.
 */
function instance(defaults, options) {
  if (!singletonQS) {
    singletonQS = queryState(defaults, options);
  } else if (defaults) {
    singletonQS.setIfEmpty(defaults);
  }

  return singletonQS;
}

function validateHistoryAPI(history) {
  if (!history) throw new Error('history is required');
  if (typeof history.dispose !== 'function') throw new Error('dispose is required');
  if (typeof history.onChanged !== 'function') throw new Error('onChanged is required');
}
