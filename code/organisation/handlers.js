"use strict";

const config = require("./config");
const db = require("db");
const mapper = require("./mapper");
const table = new db.Table({
  tableName: config.tableName,
  hashKey: "OrganisationId",
  sortKey: "UserId",
  indexes: {
    UserOrganisations: {
      hashKey: "UserId",
      sortKey: "OrganisationId",
    },
  },
});

exports.get = (organisationId, userId, response) => {
  let promise = null;
  if (userId) {
    promise = table.get(organisationId, userId);
  } else {
    promise = table.getByPartitionKey(organisationId);
  }

  promise
    .then((data) => {
      const responseBody = {
        data:
          "Items" in data ? data.Items.map(mapper.map) : mapper.map(data.Item),
      };
      response(200, responseBody, config.headers);
    })
    .catch((err) => {
      response(500, err, config.headers);
    });
};

exports.post = (organisationId, userId, payload, response) => {
  table
    .create(organisationId, userId, payload)
    .then((data) => response(200, data, config.headers))
    .catch((err) => response(500, err, config.headers));
};

exports.put = (organisationId, userId, payload, response) => {
  table
    .update(organisationId, userId, payload)
    .then((data) => response(200, data, config.headers))
    .catch((err) => response(500, err, config.headers));
};

exports.delete = (organisationId, userId, response) => {
  table
    .delete(organisationId, userId)
    .then((data) => response(200, data, config.headers))
    .catch((err) => response(500, err, config.headers));
};
