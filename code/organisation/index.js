"use strict";

const config = require("./config");
const helpers = require("moggies-lambda-helpers");
const auth = require("moggies-auth");
const handlers = require("./handlers");

exports.handler = function (event, context, callback) {
  const response = helpers.getResponseFn(callback);

  if (config.DEBUG) {
    response(200, event, config.headers);
  }

  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  const pathParams =
    pathParameters != null && "proxy" in pathParameters && pathParameters.proxy
      ? pathParameters.proxy.split("/")
      : [];
  const organisationId = pathParams[0];
  const userId = pathParams.length > 1 ? pathParams[1] : undefined;
  const payload = JSON.parse(event.body);
  try {
    if (httpMethod == "GET") {
      handlers.get(organisationId, userId, response);
    } else if (httpMethod == "POST") {
      handlers.post(organisationId, userId, payload, response);
    } else if (httpMethod == "PUT" && pathParams.length > 1) {
      handlers.put(organisationId, userId, payload, response);
    } else if (httpMethod == "DELETE" && pathParams.length > 1) {
      handlers.delete(organisationId, userId, response);
    } else {
      response(500, "Not supported.", config.headers);
    }
  } catch (err) {
    response(500, err, config.headers);
  }
};
