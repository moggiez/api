"use strict";

const get_handler = require("./get");

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

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

  try {
    if (httpMethod == "GET") {
      const customerId = pathParams[0];
      const playbookId = pathParams.length > 1 ? pathParams[1] : "";
      get_handler.get(customerId, playbookId, response);
    } else {
      response(403, "Not supported.", headers);
    }
  } catch (err) {
    response(500, err, headers);
  }
};
