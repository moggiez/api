const { Table, tableConfigs } = require("../db");
const { mockAWSLib } = require("./helpers");

describe("Table._buildBaseParams", () => {
  it("should build correct DynamoDB params", () => {
    const config = tableConfigs.loadtests;
    const { mockAWS, _ } = mockAWSLib();
    const table = new Table({ config: config, AWS: mockAWS });

    const result = table._buildBaseParams("hashKeyValue", "sortKeyValue");
    const expectedResult = {
      TableName: "loadtests",
    };
    expectedResult.Key = {};
    expectedResult.Key[config.hashKey] = "hashKeyValue";
    expectedResult.Key[config.sortKey] = "sortKeyValue";
    expect(result).toStrictEqual(expectedResult);
  });
});
