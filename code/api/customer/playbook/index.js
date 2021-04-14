"use strict";

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB({
  region: "eu-west-1",
  apiVersion: "2012-08-10",
});
const tableName = "playbooks";

const response = (status, body, headers, callback) => {
  callback(null, {
    statusCode: status,
    body: JSON.stringify(body),
    headers: headers,
  });
};

exports.handler = function (event, context, callback) {
  const headers = {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*",
  };
  response(200, { A: "B" }, headers, callback);
  const body = JSON.parse(event.body);
  const params = {
    TableName: "Restaurants",
    KeyConditionExpression: "customerId = :customerId",
    ExpressionAttributeValues: {
      ":customerId": body.customerId,
    },
  };
  dynamoDB.query(params, (err, data) => {
    if (err) {
      console.log(err);
      response(500, err, headers, callback);
    } else {
      console.log(`Data is ${data}`);
      response(200, err, data, callback);
    }
  });
};
