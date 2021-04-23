"use strict";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const mapper = require("./mapper");

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};
const tableName = "playbooks";

exports.put = (customerId, playbookId, playbook, response) => {
  var params = {
    TableName: tableName,
    Key: {
      CustomerId: customerId,
      PlaybookId: playbookId,
    },
    UpdateExpression: "set Playbook = :pb",
    ExpressionAttributeValues: {
      ":pb": playbook,
    },
    ReturnValues: "UPDATED_NEW",
  };

  docClient.update(params, (err, data) => {
    if (err) {
      response(500, err, headers);
    } else {
      const responseBody = {
        Result: "Playbook updated.",
        Playbook: JSON.parse(data.Attributes.Playbook),
      };
      response(200, responseBody, headers);
    }
  });
};
