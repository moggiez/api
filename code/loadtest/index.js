"use strict";

const config = require("./config");
const helpers = require("moggies-lambda-helpers");
const auth = require("moggies-auth");
const uuid = require("uuid");
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

  try {
    const organisationId = pathParams[0];
    const loadtestId = pathParams.length > 1 ? pathParams[1] : "";
    const payload = JSON.parse(event.body);
    if (payload) {
      payload["UserId"] = user.id;
    }

    if (httpMethod == "GET") {
      handlers.get(organisationId, loadtestId, response);
    } else if (httpMethod == "POST") {
      const loadtestId = uuid.v4();
      handlers.post(organisationId, loadtestId, payload, response);
    } else {
      response(403, "Not supported.", config.headers);
    }
  } catch (err) {
    response(500, err, config.headers);
  }
};
