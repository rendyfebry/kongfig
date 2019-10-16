'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('isomorphic-fetch');

var headers = {};

var addHeader = function addHeader(name, value) {
  headers[name] = value;
};
var clearHeaders = function clearHeaders() {
  headers = {};
};

var get = function get(uri) {
  var options = {
    method: 'GET',
    headers: {
      'Connection': 'keep-alive',
      'Accept': 'application/json'
    }
  };

  return request(uri, options);
};

var request = function request(uri, opts) {
  var requestHeaders = Object.assign({}, opts.headers, headers);

  var options = Object.assign({}, opts, { headers: requestHeaders });

  return fetchWithRetry(uri, options);
};

function fetchWithRetry(url, options) {
  var retries = 3;
  var retryDelay = 500;

  if (options && options.retries) {
    retries = options.retries;
  }

  if (options && options.retryDelay) {
    retryDelay = options.retryDelay;
  }

  return new Promise(function (resolve, reject) {
    var wrappedFetch = function wrappedFetch(n) {
      fetch(url, options).then(function (response) {
        resolve(response);
      }).catch(function (error) {
        if (n <= retries) {
          setTimeout(function () {
            wrappedFetch(n + 1);
          }, retryDelay * Math.pow(2, n));
        } else {
          reject(error);
        }
      });
    };
    wrappedFetch(0);
  });
}

exports.default = {
  addHeader: addHeader,
  clearHeaders: clearHeaders,
  get: get,
  request: request
};