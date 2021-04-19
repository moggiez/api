"use strict";

const get_handler = require("./get");
const post_handler = require("./post");
const uuid = require("uuid");

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};
const DEBUG = false;

exports.handler = function (event, context, callback) {
  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  const pathParams = pathParameters.proxy.split("/");

  const response = (status, body, headers) => {
    const httpResponse = {
      statusCode: status,
      body: JSON.stringify(body),
      headers: headers,
    };
    callback(null, httpResponse);
  };

  if (DEBUG) {
    response(200, event, headers);
  }

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
    } else {
      response(403, "Not supported.", headers);
    }
  } catch (err) {
    response(500, err, headers);
  }
};
