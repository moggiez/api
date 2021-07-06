"use strict";

const AWS = require("aws-sdk");
const db = require("moggies-db");
const helpers = require("moggies-lambda-helpers");
const auth = require("moggies-auth");
const metricsHelpers = require("moggies-metrics");

const config = require("./config");
const { Handler } = require("./handler");

exports.handler = function (event, context, callback) {
  const response = helpers.getResponseFn(callback);

  if (config.DEBUG) {
    response(200, event);
  }

  const user = auth.getUserFromEvent(event);
  const request = helpers.getRequestFromEvent(event);
  request.user = user;

  const organisations = new db.Table(db.tableConfigs.organisations);
  const loadtests = new db.Table(db.tableConfigs.loadtests);
  const loadtest_metrics = new db.Table(db.tableConfigs.loadtest_metrics);
  const CloudWatch = new AWS.CloudWatch({ apiVersion: "2010-08-01" });
  const Metrics = new metricsHelpers.Metrics(CloudWatch);
  const handler = new Handler(
    organisations,
    loadtests,
    loadtest_metrics,
    Metrics
  );
  handler.handle(request, response);
};
