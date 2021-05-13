"use strict";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const config = require("./config");

exports.put = (customerId, playbookId, playbook, response) => {
  const params = {
    TableName: config.tableName,
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
      response(500, err, config.headers);
    } else {
      const responseBody = {
        Result: "Playbook updated.",
        Playbook: JSON.parse(data.Attributes.Playbook),
      };
      response(200, responseBody, config.headers);
    }
  });
};
