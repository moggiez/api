"use strict";

const config = require("./config");
const db = require("db");
const mapper = require("./mapper");
const table = new db.Table({
  tableName: config.tableName,
  hashKey: "OrganisationId",
  sortKey: "LoadtestId",
  indexes: {
    PlaybookLoadtestIndex: {
      hashKey: "PlaybookId",
      sortKey: "LoadtestId",
    },
    UsersLoadtestsIndex: {
      hashKey: "UserId",
      sortKey: "LoadtestId",
    },
  },
});

exports.get = (organisationId, loadtestId, response) => {
  let promise = null;
  if (loadtestId) {
    promise = table.get(organisationId, loadtestId);
  } else {
    promise = table.getByPartitionKey(organisationId);
  }

  promise
    .then((data) => {
      const responseBody =
        "Items" in data
          ? {
              data: data.Items.map(mapper.map),
            }
          : mapper.map(data.Item);
      response(200, responseBody, config.headers);
    })
    .catch((err) => {
      response(500, err, config.headers);
    });
};

exports.post = (organisationId, loadtestId, payload, response) => {
  table
    .create(organisationId, loadtestId, payload)
    .then((data) => response(200, data, config.headers))
    .catch((err) => response(500, err, config.headers));
};
