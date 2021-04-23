"use strict";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};
const tableName = "playbooks";

exports.post = (customerId, playbookId, playbook, response) => {
  var params = {
    TableName: tableName,
    Item: {
      CustomerId: customerId,
      PlaybookId: playbookId,
      Playbook: playbook,
    },
  };

  docClient.put(params, (err, data) => {
    if (err) {
      response(500, err, headers);
    } else {
      const responseBody = {
        Result: "Playbook created.",
        PlaybookId: playbookId,
      };
      response(201, responseBody, headers);
    }
  });
};
