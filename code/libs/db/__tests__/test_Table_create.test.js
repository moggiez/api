const { Table, tableConfigs } = require("../db");
const { mockAWSLib } = require("./helpers");

describe("Table.create", () => {
  it("builds correct params when not versionned", () => {
    const config = tableConfigs.loadtests;
    const { mockAWS, mockedFunctions } = mockAWSLib();
    const table = new Table({ config: config, AWS: mockAWS });

    const record = {
      test1: "abc",
      test2: 1,
    };

    table.create("hashKeyValue", "sortKeyValue", record);

    const expectedResult = {
      TableName: "loadtests",
      ReturnValues: "ALL_OLD",
    };
    expectedResult.Item = record;
    expectedResult.Item[config.hashKey] = "hashKeyValue";
    expectedResult.Item[config.sortKey] = "sortKeyValue";
    const expectedUpdatedAt = new Date().toISOString();

    expect(mockedFunctions.put).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: expectedResult.TableName,
        Item: expect.objectContaining(expectedResult.Item),
      }),
      expect.any(Function)
    );
    expect(mockedFunctions.put.mock.calls[0][0].Item.CreatedAt).toContain(
      expectedUpdatedAt.substr(0, 20)
    );
    expect(mockedFunctions.put.mock.calls[0][0].Item.UpdatedAt).toContain(
      expectedUpdatedAt.substr(0, 20)
    );
    expect(mockedFunctions.put.mock.calls[0][0].Item).not.toHaveProperty(
      "Latest"
    );
  });

  it("builds correct params when versionned", () => {
    const config = tableConfigs.playbook_versions;
    const { mockAWS, mockedFunctions } = mockAWSLib();
    const table = new Table({ config: config, AWS: mockAWS });

    const record = {
      test1: "abc",
      test2: 1,
    };
    const sortKey = "v1";

    table.create("hashKeyValue", sortKey, record);

    const expectedResult = {
      TableName: "playbook_versions",
      ReturnValues: "ALL_OLD",
    };
    expectedResult.Item = record;
    expectedResult.Item[config.hashKey] = "hashKeyValue";
    expectedResult.Item[config.sortKey] = sortKey;
    expectedResult.Item.Latest = 0;
    const expectedUpdatedAt = new Date().toISOString();

    expect(mockedFunctions.put).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: expectedResult.TableName,
        Item: expect.objectContaining(expectedResult.Item),
      }),
      expect.any(Function)
    );
    expect(mockedFunctions.put.mock.calls[0][0].Item).not.toHaveProperty(
      "CreatedAt"
    );
    expect(mockedFunctions.put.mock.calls[0][0].Item.UpdatedAt).toContain(
      expectedUpdatedAt.substr(0, 20)
    );
  });

  it("throws error when versionned and sort key doesn't match version pattern", () => {
    const config = tableConfigs.playbook_versions;
    const { mockAWS, mockedFunctions } = mockAWSLib();
    const table = new Table({ config: config, AWS: mockAWS });

    const record = {
      test1: "abc",
      test2: 1,
    };
    const sortKey = "vA";

    expect(() => table.create("hashKeyValue", sortKey, record)).toThrow(
      `Sort key '${sortKey}' doesn't match expected pattern /v[0-9]+/g`
    );
  });

  it("doesn't throw error when versionned and sort key matches version pattern", () => {
    const config = tableConfigs.playbook_versions;
    const { mockAWS, mockedFunctions } = mockAWSLib();
    const table = new Table({ config: config, AWS: mockAWS });

    const record = {
      test1: "abc",
      test2: 1,
    };
    const sortKey = "v999";

    expect(() => table.create("hashKeyValue", sortKey, record)).not.toThrow();
  });
});
