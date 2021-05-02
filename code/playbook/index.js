"use strict";

const get_handler = require("./get");
const post_handler = require("./post");
const put_handler = require("./put");
const uuid = require("uuid");
const config = require("./config");

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
      const playbookId = pathParams.length > 1 ? pathParams[1] : "";
      get_handler.get(customerId, playbookId, response);
    } else if (httpMethod == "POST") {
      const customerId = pathParams[0];
      const playbookId = uuid.v4();
      const playbook = event.body;
      post_handler.post(customerId, playbookId, playbook, response);
    } else if (httpMethod == "PUT" && pathParams.length > 1) {
      const customerId = pathParams[0];
      const playbookId = pathParams[1];
      const playbook = event.body;
      put_handler.put(customerId, playbookId, playbook, response);
    } else {
      response(403, "Not supported.", config.headers);
    }
  } catch (err) {
    response(500, err, config.headers);
  }
};
