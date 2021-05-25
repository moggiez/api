"use strict";

const config = require("./config");
const db = require("db");
const mapper = require("./mapper");
const orgTable = new db.Table(db.tableConfigs.organisations);

exports.getOrg = (userId, response) => {
  const promise = orgTable.getBySecondaryIndex("UserOrganisations", userId);

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
