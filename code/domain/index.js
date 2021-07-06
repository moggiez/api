"use strict";

const AWS = require("aws-sdk");
const db = require("moggies-db");

const config = require("./config");
const helpers = require("moggies-lambda-helpers");
const auth = require("moggies-auth");
const { Handler } = require("./handler");

exports.handler = function (event, context, callback) {
  const response = helpers.getResponseFn(callback);

  if (config.DEBUG) {
    response(200, event);
  }

  const user = auth.getUserFromEvent(event);
  const request = helpers.getRequestFromEvent(event);
  request.user = user;

  const table = new db.Table({ config: db.tableConfigs.domains, AWS: AWS });

  const handler = new Handler(table);
  handler.handle(request, response);
};
