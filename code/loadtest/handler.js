"use strict";

const uuid = require("uuid");

class Handler {
  constructor(table) {
    const expectedTableName = "loadtests";
    if (table && table.getConfig().tableName != expectedTableName) {
      throw new Error(
        `Constructor expects '${expectedTableName}' table passed. The passed table name does not match '${expectedTableName}'.`
      );
    }
    this.table = table;
  }

  handle = async (request, response) => {
    try {
      const organisationId = request.getPathParamAtIndex(0, "");
      const loadtestId = request.getPathParamAtIndex(1, "");
      const payload = request.body;
      if (payload) {
        payload["UserId"] = request.user.id;
      }

      if (request.httpMethod == "GET") {
        await this.get(organisationId, loadtestId, response);
      } else if (request.httpMethod == "POST") {
        await this.post(organisationId, payload, response);
      } else if (request.httpMethod == "DELETE") {
        await this.delete(organisationId, loadtestId, response);
      } else {
        response(403, "Not supported.");
      }
    } catch (err) {
      console.log(err);
      response(500, err);
    }
  };

  get = async (organisationId, loadtestId, response) => {
    let data = null;
    try {
      if (loadtestId) {
        data = await this.table.get(organisationId, loadtestId);
      } else {
        data = await this.table.getByPartitionKey(organisationId);
      }
      const responseBody =
        "Items" in data
          ? {
              data: data.Items.map((item) => item),
            }
          : data.Item;
      response(200, responseBody);
    } catch (err) {
      console.log(err);
      response(500, err);
    }
  };

  post = async (organisationId, payload, response) => {
    payload["CreatedAtHour"] = new Date().toISOString().substring(0, 13);
    payload["MetricsSavedDate"] = "null";
    const loadtestId = uuid.v4();
    try {
      const data = await this.table.create(organisationId, loadtestId, payload);
      data["LoadtestId"] = loadtestId;
      response(200, data);
    } catch (err) {
      console.log(err);
      response(500, err);
    }
  };

  delete = async (organisationId, loadtestId, response) => {
    try {
      const data = await this.table.delete(organisationId, loadtestId);
      response(200, data);
    } catch (err) {
      response(500, err);
    }
  };
}

exports.Handler = Handler;
