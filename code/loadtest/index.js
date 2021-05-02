"use strict";

const config = require("./config");
const get_handler = require("./get");
const post_handler = require("./post");
const uuid = require("uuid");

exports.handler = function (event, context, callback) {
  const response = (status, body, headers) => {
    const httpResponse = {
      statusCode: status,
      body: JSON.stringify(body),
      headers: headers,
    };
    callback(null, httpResponse);
  };

  if (config.DEBUG) {
    response(200, event, config.headers);
  }

  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  const pathParams =
    pathParameters != null && "proxy" in pathParameters && pathParameters.proxy
      ? pathParameters.proxy.split("/")
      : [];

  try {
    if (httpMethod == "GET") {
      const customerId = pathParams[0];
      const loadtestId = pathParams.length > 1 ? pathParams[1] : "";
      get_handler.get(customerId, loadtestId, response);
    } else if (httpMethod == "POST") {
      const customerId = pathParams[0];
      const loadtestId = uuid.v4();
      const playbookId = JSON.parse(event.body).playbookId;
      post_handler.post(customerId, loadtestId, playbookId, response);
    } else {
      response(403, "Not supported.", config.headers);
    }
  } catch (err) {
    response(500, err, config.headers);
  }
};
