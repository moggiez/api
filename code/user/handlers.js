"use strict";

const config = require("./config");
const db = require("./db");
const mapper = require("./mapper");
const orgTable = new db.Table({
  tableName: config.tableName,
  hashKey: "OrganisationId",
  sortKey: "UserId",
  mapper: mapper,
});

exports.getOrg = (userId, response) => {
  const promise = orgTable.querySecondaryIndex("UserOrganisations", userId);

  promise
    .then((data) => {
      const responseBody = {
        data: data.Items.map(mapper.map),
      };
      response(200, responseBody, config.headers);
    })
    .catch((err) => {
      response(500, err, config.headers);
    });
};
