const { Table, tableConfigs } = require("../db");
const { mockAWSLib } = require("./helpers");

describe("Table.query", () => {
  it("builds params when key condition and filter provided", () => {
    const config = tableConfigs.loadtests;
    const { mockAWS, mockedFunctions } = mockAWSLib();
    const table = new Table({ config: config, AWS: mockAWS });

    const filter = {
      expression: "Active = :active",
      attributes: {
        active: 1,
      },
    };

    table.query("hashKeyValue", "sortKeyValue", filter);

    const expectedResult = {
      TableName: "loadtests",
      KeyConditionExpression: "#pk = :pkv and #skv = :skv",
      ExpressionAttributeNames: {
        "#pk": config.hashKey,
        "#skv": config.sortKey,
      },
      ExpressionAttributeValues: {
        ":pkv": "hashKeyValue",
        ":skv": "sortKeyValue",
        ":active": filter.attributes.active,
      },
      FilterExpression: filter.expression,
    };

    expect(mockedFunctions.query).toHaveBeenCalledWith(
      expectedResult,
      expect.any(Function)
    );
  });
});
