"use strict";

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB({
  region: "eu-west-1",
  apiVersion: "2012-08-10",
});
const tableName = "playbooks";

const response = (status, body, headers, callback) => {
  const httpResponse = {
    statusCode: status,
    body: JSON.stringify(body),
    headers: headers,
  };
  console.log("httpResponse", httpResponse);
  callback(null, httpResponse);
};

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

exports.handler = function (event, context, callback) {
  const pathParameters = event.pathParameters;
  const proxy = pathParameters.proxy;
  const params = {
    ExpressionAttributeValues: {
      ":customerId": { S: proxy },
    },
    KeyConditionExpression: "customerId = :customerId",
    TableName: "playbooks",
  };
  dynamoDB.query(params, (err, data) => {
    if (err) {
      console.log(err);
      response(500, err, headers, callback);
    } else {
      console.log(`Data is ${JSON.stringify(data)}`);
      const responseBody = {
        data: data.Items,
      };
      console.log(`Data is ${JSON.stringify(responseBody)}`);
      response(200, responseBody, headers, callback);
    }
  });
};
