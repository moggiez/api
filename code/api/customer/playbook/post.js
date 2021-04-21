"use strict";

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB({
  region: "eu-west-1",
  apiVersion: "2012-08-10",
});

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};
const tableName = "playbooks";

exports.post = (customerId, playbookId, playbook, response) => {
  var params = {
    TableName: tableName,
    Item: {
      CustomerId: { S: customerId },
      PlaybookId: { S: playbookId },
      Playbook: { S: playbook },
    },
  };

  dynamoDB.putItem(params, (err, data) => {
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
