"use strict";

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB({
  region: "eu-west-1",
  apiVersion: "2012-08-10",
});
const config = require("./config");
const mapper = require("./mapper");

exports.get = (organisationId, loadtestId, response) => {
  let keyQuery = "OrganisationId = :oid";
  let attributeValues = {
    ":oid": { S: organisationId },
  };
  if (loadtestId) {
    keyQuery += " AND LoadtestId = :ltid";
    attributeValues[":ltid"] = { S: loadtestId };
  }

  const params = {
    KeyConditionExpression: keyQuery,
    ExpressionAttributeValues: attributeValues,
    TableName: config.tableName,
  };
  dynamoDB.query(params, (err, data) => {
    if (err) {
      response(500, err, config.headers);
    } else {
      if (loadtestId && data.Items.length == 1) {
        response(200, mapper.map(data.Items[0]), config.headers);
      } else {
        const responseBody = {
          data: data.Items.map(mapper.map),
        };
        response(200, responseBody, config.headers);
      }
    }
  });
};
