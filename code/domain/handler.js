"use strict";

class Handler {
  constructor(table) {
    const expectedTableName = "domains";
    if (table && table.getConfig().tableName != expectedTableName) {
      throw new Error(
        `Constructor expects '${expectedTableName}' table passed. The passed table name does not match '${expectedTableName}'.`
      );
    }
    this.table = table;
  }

  handle = async (request, response) => {
    const organisationId = request.getPathParamAtIndex(0, "");
    const domainName = request.getPathParamAtIndex(1, "");
    const payload = request.body;
    try {
      if (request.httpMethod == "GET") {
        this.get(organisationId, domainName, response);
      } else if (request.httpMethod == "POST") {
        this.post(organisationId, domainName, payload, response);
      } else if (
        request.httpMethod == "PUT" &&
        request.pathParameters.length > 1
      ) {
        this.put(organisationId, domainName, payload, response);
      } else if (
        request.httpMethod == "DELETE" &&
        request.pathParameters.length > 1
      ) {
        this.delete(organisationId, domainName, response);
      } else {
        response(500, "Not supported.");
      }
    } catch (err) {
      response(500, err);
    }
  };

  get = async (organisationId, domainName, response) => {
    let data = null;
    try {
      if (domainName) {
        data = await this.table.get(organisationId, domainName);
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
      response(500, err);
    }
  };

  post = async (organisationId, domainName, payload, response) => {
    try {
      const data = await this.table.create(organisationId, domainName, payload);
      response(200, data);
    } catch (err) {
      response(500, err);
    }
  };

  put = async (organisationId, domainName, payload, response) => {
    try {
      const data = await this.table.update(organisationId, domainName, payload);
      response(200, data);
    } catch (err) {
      response(500, err);
    }
  };

  delete = async (organisationId, domainName, response) => {
    try {
      const data = await this.table.delete(organisationId, domainName);
      response(200, data);
    } catch (err) {
      response(500, err);
    }
  };
}

exports.Handler = Handler;
