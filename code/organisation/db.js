const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

class Table {
  constructor(config) {
    this.tableName = config.tableName;
    this.hashKey = config.hashKey;
    this.sortKey = config.sortKey;
    this.mapper = config.mapper;
  }

  _buildBaseParams(hashKeyValue, sortKeyValue) {
    let params = {
      TableName: this.tableName,
      Key: {},
    };
    params.Key[this.hashKey] = hashKeyValue;
    params.Key[this.sortKey] = sortKeyValue;

    return params;
  }

  getByPartitionKey(hashKeyValue) {
    return new Promise((resolve, reject) => {
      try {
        const params = {
          TableName: this.tableName,
          KeyConditionExpression: "#pk = :pkv",
          ExpressionAttributeNames: {
            "#pk": this.hashKey,
          },
          ExpressionAttributeValues: {
            ":pkv": hashKeyValue,
          },
        };
        docClient.query(params, function (err, data) {
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
        docClient.get(params, function (err, data) {
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
        const params = this._buildBaseParams(hashKeyValue, sortKeyValue);
        params.IndexName = indexName;
        docClient.get(params, function (err, data) {
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
        params.Item = recordAttributesObject;
        params.Item[this.hashKey] = hashKeyValue;
        params.Item[this.sortKey] = sortKeyValue;
        params.ReturnValues = "ALL_OLD";
        docClient.put(params, (err, data) => {
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
        let params = this._buildBaseParams(hashKeyValue, sortKeyValue);
        params.UpdateExpression = "set ";
        params.ExpressionAttributeValues = {};
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
        docClient.update(params, (err, data) => {
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
        docClient.delete(params, (err, data) => {
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

exports.Table = Table;
