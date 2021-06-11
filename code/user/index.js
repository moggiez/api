"use strict";

const config = require("./config");
const helpers = require("lambda_helpers");
const auth = require("cognitoAuth");
const handlers = require("./handlers");

exports.handler = function (event, context, callback) {
  const response = helpers.getResponseFn(callback);

  if (config.DEBUG) {
    response(200, event, config.headers);
  }

  const user = auth.getUserFromEvent(event);

  const httpMethod = event.httpMethod;
  try {
    if (httpMethod == "GET") {
      handlers.getOrg(user.id, response);
    } else {
      response(500, "Not supported.", config.headers);
    }
  } catch (err) {
    response(500, err, config.headers);
  }
};
