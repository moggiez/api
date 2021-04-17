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

exports.get = (customerId, playbookId, response) => {
  const params = {
    ExpressionAttributeValues: {
      ":customerId": { S: customerId },
    },
    KeyConditionExpression: "customerId = :customerId",
    TableName: tableName,
  };
  dynamoDB.query(params, (err, data) => {
    if (err) {
      response(500, err, headers);
    } else {
      const responseBody = {
        data: data.Items,
      };
      response(200, responseBody, headers);
    }
  });
};
