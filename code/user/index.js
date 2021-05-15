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
  const pathParameters = event.pathParameters;
  const pathParams =
    pathParameters != null && "proxy" in pathParameters && pathParameters.proxy
      ? pathParameters.proxy.split("/")
      : [];
  const userId = pathParams[0];
  try {
    if (httpMethod == "GET") {
      if (userId == user.id) {
        handlers.getOrg(userId, response);
      } else {
        response(403, "Not authorized.", config.headers);
      }
    } else {
      response(500, "Not supported.", config.headers);
    }
  } catch (err) {
    response(500, err, config.headers);
  }
};
