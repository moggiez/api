class Table {
  constructor({ config, AWS }) {
    this.config = config;

    let env = "prod";
    let awsConfig = {};
    try {
      env = process.env.env;
      if (env == "local") {
        awsConfig[
          "endpoint"
        ] = `http://${process.env.LOCALSTACK_HOSTNAME}:4566`;
      }
    } catch (errEnv) {
      console.log("Unable to retrieve 'env'", err);
    }
    this.docClient = new AWS.DynamoDB.DocumentClient(awsConfig);
  }

  _buildBaseParams(hashKeyValue, sortKeyValue) {
    let params = {
      TableName: this.config.tableName,
      Key: {},
    };
    params.Key[this.config.hashKey] = hashKeyValue;
    params.Key[this.config.sortKey] = sortKeyValue;

    return params;
  }

  /**
   *
   * @param {*} indexName Secondary index name
   * @param {*} hashKeyValue Value of the hash key
   * @param {*} sortKeyValue Value of the sort key
   * @param {*} filter Filter object with 2 properties:
   *  'expression' which should be a filter expression
   *  'attributes' which should be an object where each property is a value in the filter expression
   *  Example:
   *  {
   *    expression: 'Active = :active:',
   *    attributes: {
   *      active: 1
   *    }
   *  }
   * @returns
   */
  _buildQueryParams(indexName, hashKeyValue, sortKeyValue, filter) {
    const params = {
      TableName: this.config.tableName,
      KeyConditionExpression: "#pk = :pkv",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {
        ":pkv": hashKeyValue,
      },
    };

    if (indexName) {
      params.IndexName = indexName;
      params.ExpressionAttributeNames["#pk"] =
        this.config.indexes[indexName].hashKey;

      if (sortKeyValue) {
        params.KeyConditionExpression += " and #skv = :skv";
        params.ExpressionAttributeNames["#skv"] =
          this.config.indexes[indexName].sortKey;
        params.ExpressionAttributeValues[":skv"] = sortKeyValue;
      }
    } else {
      params.ExpressionAttributeNames["#pk"] = this.config.hashKey;

      if (sortKeyValue) {
        params.KeyConditionExpression += " and #skv = :skv";
        params.ExpressionAttributeNames["#skv"] = this.config.sortKey;
        params.ExpressionAttributeValues[":skv"] = sortKeyValue;
      }
    }

    if (filter) {
      params.FilterExpression = filter.expression;
      Object.entries(filter.attributes).forEach(([key, value], _) => {
        params.ExpressionAttributeValues[`:${key}`] = value;
      });
    }

    return params;
  }

  getConfig() {
    return this.config;
  }

  getByPartitionKey(hashKeyValue) {
    return new Promise((resolve, reject) => {
      try {
        const params = {
          TableName: this.config.tableName,
          KeyConditionExpression: "#pk = :pkv",
          ExpressionAttributeNames: {
            "#pk": this.config.hashKey,
          },
          ExpressionAttributeValues: {
            ":pkv": hashKeyValue,
          },
        };
        this.docClient.query(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (exc) {
        reject(exc);
      }
    });
  }

  getBySecondaryIndex(indexName, hashKeyValue, sortKeyValue) {
    return new Promise((resolve, reject) => {
      try {
        if (
          !("indexes" in this.config) ||
          !(indexName in this.config.indexes)
        ) {
          reject("Secondary index not found.");
        }

        const params = this._buildQueryParams(
          indexName,
          hashKeyValue,
          sortKeyValue
        );

        this.docClient.query(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (exc) {
        reject(exc);
      }
    });
  }

  get(hashKeyValue, sortKeyValue) {
    return new Promise((resolve, reject) => {
      try {
        const params = this._buildBaseParams(hashKeyValue, sortKeyValue);
        this.docClient.get(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (exc) {
        reject(exc);
      }
    });
  }

  /**
   *
   * @param {*} hashKeyValue Hash key of the table
   * @param {*} sortKeyValue Sort key of the table
   * @param {*} filter Filter object. Should contain 'expression' and 'attributes' properties.
   * @returns A promise which should resolve with data fetched by using the argument provided or an error
   */
  query(hashKeyValue, sortKeyValue, filter) {
    return new Promise((resolve, reject) => {
      try {
        const params = this._buildQueryParams(
          null,
          hashKeyValue,
          sortKeyValue,
          filter
        );

        this.docClient.query(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (exc) {
        reject(exc);
      }
    });
  }

  create(hashKeyValue, sortKeyValue, recordAttributesObject) {
    return new Promise((resolve, reject) => {
      try {
        let params = this._buildBaseParams(hashKeyValue, sortKeyValue);
        delete params.Key;

        const dateStr = new Date().toISOString();
        params.Item = recordAttributesObject;
        params.Item["CreatedAt"] = dateStr;
        params.Item["UpdatedAt"] = dateStr;
        params.Item[this.config.hashKey] = hashKeyValue;
        params.Item[this.config.sortKey] = sortKeyValue;
        params.ReturnValues = "ALL_OLD";
        this.docClient.put(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (exc) {
        reject(exc);
      }
    });
  }

  update(hashKeyValue, sortKeyValue, fieldUpdatesDict) {
    return new Promise((resolve, reject) => {
      try {
        delete fieldUpdatesDict["CreatedAt"];
        delete fieldUpdatesDict["UpdatedAt"];
        let params = this._buildBaseParams(hashKeyValue, sortKeyValue);
        params.UpdateExpression = `set UpdatedAt = :sfUpdatedAt,`;
        params.ExpressionAttributeValues = {
          ":sfUpdatedAt": new Date().toISOString(),
        };
        params.ReturnValues = "ALL_NEW";

        Object.entries(fieldUpdatesDict).forEach((element, index, array) => {
          const fieldName = element[0];
          const fieldNewValue = element[1];
          const valuePlaceholder = `:f${index}`;
          params.UpdateExpression += `${fieldName} = ${valuePlaceholder}${
            index + 1 < array.length ? "," : ""
          }`;
          params.ExpressionAttributeValues[valuePlaceholder] = fieldNewValue;
        });

        this.docClient.update(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (exc) {
        reject(exc);
      }
    });
  }

  delete(hashKeyValue, sortKeyValue) {
    return new Promise((resolve, reject) => {
      try {
        const params = this._buildBaseParams(hashKeyValue, sortKeyValue);
        this.docClient.delete(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }
}

const defaultMapper = {
  map: (dynamoDbItem) => {
    return dynamoDbItem;
  },
};

const tableConfigs = {
  loadtests: {
    tableName: "loadtests",
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
      CreatedAtHourIndex: {
        hashKey: "CreatedAtHour",
        sortKey: "MetricsSavedDate",
      },
    },
  },
  playbooks: {
    tableName: "playbooks",
    hashKey: "OrganisationId",
    sortKey: "PlaybookId",
  },
  organisations: {
    tableName: "organisations",
    hashKey: "OrganisationId",
    sortKey: "UserId",
    indexes: {
      UserOrganisations: {
        hashKey: "UserId",
        sortKey: "OrganisationId",
      },
    },
  },
  domains: {
    tableName: "domains",
    hashKey: "OrganisationId",
    sortKey: "DomainName",
    mapper: defaultMapper,
  },
  loadtest_metrics: {
    tableName: "loadtest_metrics",
    hashKey: "LoadtestId",
    sortKey: "MetricName",
  },
};

exports.Table = Table;
exports.tableConfigs = tableConfigs;
