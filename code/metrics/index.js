"use strict";

const auth = require("cognitoAuth");
const config = require("./config");
const handlers = require("./handlers");
const helpers = require("lambda_helpers");

exports.handler = function (event, context, callback) {
  const response = helpers.getResponseFn(callback);

  if (config.DEBUG) {
    response(200, event, config.headers);
  }

  const httpMethod = event.httpMethod;
  try {
    if (httpMethod == "GET") {
      handlers.get(response);
    } else {
      response(500, "Not supported.", config.headers);
    }
  } catch (err) {
    response(500, err, config.headers);
  }
};
