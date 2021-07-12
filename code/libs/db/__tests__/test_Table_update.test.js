const { Table, tableConfigs } = require("../db");
const { mockAWSLib } = require("./helpers");

describe("Table.update", () => {
  it("builds correct params when not versionned", () => {
    const config = tableConfigs.loadtests;
    const { mockAWS, mockedFunctions } = mockAWSLib();
    const table = new Table({ config: config, AWS: mockAWS });

    const updatedFields = {
      test1: "abc",
      test2: 1,
    };

    table.update({ hashKey: "hashKeyValue", sortKey: "v0", updatedFields });

    const expectedResult = {
      TableName: "loadtests",
      Key: {},
      ReturnValues: "ALL_NEW",
    };
    expectedResult.Key[config.hashKey] = "hashKeyValue";
    expectedResult.Key[config.sortKey] = "v0";
    expectedResult.UpdateExpression = `SET  UpdatedAt = :sfUpdatedAt, test1 = :f0, test2 = :f1`;
    expectedResult.ExpressionAttributeValues = {
      ":f0": updatedFields.test1,
      ":f1": updatedFields.test2,
    };
    const expectedUpdatedAt = new Date().toISOString();

    expect(mockedFunctions.update).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: expectedResult.TableName,
        Key: expectedResult.Key,
        ReturnValues: expectedResult.ReturnValues,
        ExpressionAttributeValues: expect.objectContaining(
          expectedResult.ExpressionAttributeValues
        ),
      }),
      expect.any(Function)
    );
    expect(
      mockedFunctions.update.mock.calls[0][0].ExpressionAttributeValues[
        ":sfUpdatedAt"
      ]
    ).toContain(expectedUpdatedAt.substr(0, 20));
  });

  it("builds correct params when versionned", () => {
    const config = tableConfigs.playbook_versions;
    const { mockAWS, mockedFunctions } = mockAWSLib();
    const table = new Table({ config: config, AWS: mockAWS });

    const updatedFields = {
      test1: "abc",
      test2: 1,
    };

    table.update({ hashKey: "hashKeyValue", sortKey: "v0", updatedFields });

    const expectedResult = {
      TableName: "playbook_versions",
      Key: {},
      ReturnValues: "ALL_NEW",
    };
    expectedResult.Key[config.hashKey] = "hashKeyValue";
    expectedResult.Key[config.sortKey] = "v0";
    expectedResult.UpdateExpression = `SET Latest = if_not_exists(Latest, :defaultval) + :incrval, UpdatedAt = :sfUpdatedAt, test1 = :f0, test2 = :f1`;
    expectedResult.ExpressionAttributeValues = {
      ":defaultval": 0,
      ":incrval": 1,
      ":f0": updatedFields.test1,
      ":f1": updatedFields.test2,
    };
    const expectedUpdatedAt = new Date().toISOString();

    expect(mockedFunctions.update).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: expectedResult.TableName,
        Key: expectedResult.Key,
        ReturnValues: expectedResult.ReturnValues,
        ExpressionAttributeValues: expect.objectContaining(
          expectedResult.ExpressionAttributeValues
        ),
      }),
      expect.any(Function)
    );
    expect(
      mockedFunctions.update.mock.calls[0][0].ExpressionAttributeValues[
        ":sfUpdatedAt"
      ]
    ).toContain(expectedUpdatedAt.substr(0, 20));
  });

  it("throws error when attempt to update version != v0", () => {
    const config = tableConfigs.playbook_versions;
    const { mockAWS, mockedFunctions } = mockAWSLib();
    const table = new Table({ config: config, AWS: mockAWS });

    const updatedFields = {
      test1: "abc",
      test2: 1,
    };

    expect(() =>
      table.update({ hashKey: "hashKeyValue", sortKey: "v1", updatedFields })
    ).toThrow(
      "You can only update records with version 'v0' when table is using versionning."
    );
  });

  it("doesn't throw error when attempt to update version == v0", () => {
    const config = tableConfigs.playbook_versions;
    const { mockAWS, mockedFunctions } = mockAWSLib();
    const table = new Table({ config: config, AWS: mockAWS });

    const updatedFields = {
      test1: "abc",
      test2: 1,
    };

    expect(() =>
      table.update({ hashKey: "hashKeyValue", sortKey: "v0", updatedFields })
    ).not.toThrow();
  });
});
