"use strict";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const config = require("./config");

exports.post = (organisationId, playbookId, playbook, response) => {
  const params = {
    TableName: config.tableName,
    Item: {
      OrganisationId: organisationId,
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
