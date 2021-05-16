"use strict";

const config = require("./config");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.post = (organisationId, loadtestId, playbookId, response) => {
  const params = {
    TableName: config.tableName,
    Item: {
      OrganisationId: organisationId,
      LoadtestId: loadtestId,
      PlaybookId: playbookId,
    },
  };

  docClient.put(params, (err, data) => {
    if (err) {
      response(500, err, config.headers);
    } else {
      const responseBody = {
        Result: "Loadtest created.",
        LoadtestId: loadtestId,
      };
      response(201, responseBody, config.headers);
    }
  });
};
