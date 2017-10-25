/**
 * This module is similar to JSON, but it encodes/decodes in query string
 * format `key1=value1...`
 */
module.exports = {
  parse: parse,
  stringify: stringify
};

function stringify(object) {
  if (!object) return '';

  return Object.keys(object).map(toPairs).join('&');

  function toPairs(key) {
    var value = object[key];
    var pair = encodePart(key);
    if (value !== undefined) {
      pair += '=' + encodeValue(value);
    }

    return pair;
  }
}

function parse(queryString) {
  var query = Object.create(null);

  if (!queryString) return query;

  queryString.split('&').forEach(decodeRecord);

  return query;

  function decodeRecord(queryRecord) {
    if (!queryRecord) return;

    var pair = queryRecord.split('=');
    query[decodeURIComponent(pair[0])] = decodeValue(pair[1]);
  }
}

function encodeValue(value) {
  // TODO: Do I need this?
  // if (typeof value === 'string') {
  //   if (value.match(/^(true|false)$/)) {
  //     // special handling of strings that look like booleans
  //     value = JSON.stringify('' + value);
  //   } else if (value.match(/^-?\d+\.?\d*$/)) {
  //     // special handling of strings that look like numbers
  //     value = JSON.stringify('' + value);
  //   }
  // }
  if (value instanceof Date) {
    value = value.toISOString();
  }
  var uriValue = encodePart(value);
  return uriValue;
}

function encodePart(part) {
  // We want to make sure that we also encode symbols like ( and ) correctly
  var encoded = encodeURIComponent(part);
  return encoded.replace(/[()]/g, saferEscape);
}

function saferEscape(character) {
  if (character === ')') return '%29';
  if (character === '(') return '%28';
  return character; // What?
}

/**
 * This method returns typed value from string
 */
function decodeValue(value) {
  value = decodeURIComponent(value);

  if (value === "") return value;
  if (!isNaN(value)) return parseFloat(value);
  if (isBolean(value)) return value === 'true';
  if (isISODateString(value)) return new Date(value);

  return value;
}

function isBolean(strValue) {
  return strValue === 'true' || strValue === 'false';
}

function isISODateString(str) {
  return str && str.match(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/)
}
