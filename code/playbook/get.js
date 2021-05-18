"use strict";

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB({
  region: "eu-west-1",
  apiVersion: "2012-08-10",
});
const config = require("./config");
const mapper = require("./mapper");

exports.get = (organisationId, playbookId, response) => {
  let keyQuery = "OrganisationId = :oid";
  let attributeValues = {
    ":oid": { S: organisationId },
  };
  if (playbookId) {
    keyQuery += " AND PlaybookId = :pid";
    attributeValues[":pid"] = { S: playbookId };
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
      if (playbookId && data.Items.length == 1) {
        response(200, mapper.map(data.Items[0]), config.headers);
      } else {
        const responseBody =
          "Items" in data
            ? {
                data: data.Items.map(mapper.map),
              }
            : mapper.map(data.Item);
        response(200, responseBody, config.headers);
      }
    }
  });
};
