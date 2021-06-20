"use strict";

const config = require("./config");
const db = require("moggies-db");
const mapper = require("./mapper");
const table = new db.Table(db.tableConfigs.loadtests);

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
      console.log(err);
      response(500, err, config.headers);
    });
};

exports.post = (organisationId, loadtestId, payload, response) => {
  payload["CreatedAtHour"] = new Date().toISOString().substring(0, 13);
  payload["MetricsSavedDate"] = "null";
  table
    .create(organisationId, loadtestId, payload)
    .then((data) => {
      data["LoadtestId"] = loadtestId;
      response(200, data, config.headers);
    })
    .catch((err) => {
      console.log(err);
      response(500, err, config.headers);
    });
};
