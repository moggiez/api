"use strict";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const config = require("./config");

exports.post = (customerId, playbookId, playbook, response) => {
  var params = {
    TableName: config.tableName,
    Item: {
      CustomerId: customerId,
      PlaybookId: playbookId,
      Playbook: playbook,
    },
  };

  docClient.put(params, (err, data) => {
    if (err) {
      response(500, err, config.headers);
    } else {
      const responseBody = {
        Result: "Playbook created.",
        PlaybookId: playbookId,
      };
      response(201, responseBody, config.headers);
    }
  });
};
