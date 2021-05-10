"use strict";

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

  response(500, "Not implemented.", config.headers);
};
