"use strict";

const config = require("./config");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.post = (customerId, loadtestId, playbookId, response) => {
  var params = {
    TableName: config.tableName,
    Item: {
      CustomerId: customerId,
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
