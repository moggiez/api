"use strict";

const auth = require("cognitoAuth");
const config = require("./config");
const handlers = require("./handlers");
const helpers = require("lambda_helpers");

exports.handler = async function (event, context, callback) {
  const response = helpers.getResponseFn(callback);
  const request = helpers.getRequestFromEvent(event);
  const user = auth.getUserFromEvent(event);

  if (config.DEBUG) {
    response(200, event, config.headers);
  }

  try {
    const loadtestId = request.getPathParamAtIndex(0, "");
    const metricName = request.getPathParamAtIndex(1, "ResponseTime");
    if (request.httpMethod == "GET") {
      await handlers.get(user, loadtestId, metricName, response);
    } else if (request.httpMethod == "POST") {
      await handlers.post(user, loadtestId, metricName, request.body, response);
    } else {
      response(500, "Not supported.", config.headers);
    }
  } catch (err) {
    console.log(err);
    response(500, err, config.headers);
  }
};
