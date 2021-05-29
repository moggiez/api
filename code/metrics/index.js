"use strict";

const auth = require("cognitoAuth");
const config = require("./config");
const handlers = require("./handlers");
const helpers = require("lambda_helpers");

exports.handler = function (event, context, callback) {
  const response = helpers.getResponseFn(callback);
  const request = helpers.getRequestFromEvent(event);
  const user = auth.getUserFromEvent(event);

  if (config.DEBUG) {
    response(200, event, config.headers);
  }

  try {
    if (request.httpMethod == "GET") {
      const loadtestId = request.getPathParamAtIndex(0, "");
      handlers.get(user, loadtestId, response);
    } else {
      response(500, "Not supported.", config.headers);
    }
  } catch (err) {
    console.log(err);
    response(500, err, config.headers);
  }
};
