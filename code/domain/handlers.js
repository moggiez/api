"use strict";

const config = require("./config");
const db = require("db");
const mapper = require("./mapper");
const table = new db.Table({
  tableName: config.tableName,
  hashKey: "OrganisationId",
  sortKey: "DomainName",
  mapper: mapper,
});

exports.get = (organisationId, domainName, response) => {
  let promise = null;
  if (domainName) {
    promise = table.get(organisationId, domainName);
  } else {
    promise = table.getByPartitionKey(organisationId);
  }

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

exports.post = (organisationId, domainName, payload, response) => {
  table
    .create(organisationId, domainName, payload)
    .then((data) => response(200, data, config.headers))
    .catch((err) => response(500, err, config.headers));
};

exports.put = (organisationId, domainName, payload, response) => {
  table
    .update(organisationId, domainName, payload)
    .then((data) => response(200, data, config.headers))
    .catch((err) => response(500, err, config.headers));
};

exports.delete = (organisationId, domainName, response) => {
  table
    .delete(organisationId, domainName)
    .then((data) => response(200, data, config.headers))
    .catch((err) => response(500, err, config.headers));
};
