"use strict";

const AWS = require("aws-sdk");
const db = require("moggies-db");

const helpers = require("moggies-lambda-helpers");
const auth = require("moggies-auth");
const config = require("./config");
const { Handler } = require("./handler");

exports.handler = function (event, context, callback) {
  const response = helpers.getResponseFn(callback);

  if (config.DEBUG) {
    response(200, event, config.headers);
  }

  const user = auth.getUserFromEvent(event);
  const request = helpers.getRequestFromEvent(event);
  request.user = user;

  const table = new db.Table({ config: db.tableConfigs.loadtests, AWS: AWS });
  const handler = new Handler(table);
  handler.handle(request, response);
};
