"use strict";

const config = require("./config");
const helpers = require("./helpers");
const auth = require("./auth");

exports.handler = function (event, context, callback) {
  const response = helpers.getResponseFn(callback);
  if (config.DEBUG) {
    response(200, event, config.headers);
  }

  response(200, auth.getUserFromEvent(event), config.headers);
};
