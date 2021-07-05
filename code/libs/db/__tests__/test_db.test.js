const { Table } = require("../db");
const { mockAWSLib } = require("./helpers");

describe("Table", () => {
  it("could be instantiated", () => {
    const mockConfig = {};
    const { mockAWS, _ } = mockAWSLib();
    const table = new Table({ config: mockConfig, AWS: mockAWS });
    expect(table).not.toBeUndefined();
    expect(table).not.toBeNull();
  });

  it("get calls AWS.DynamoDB.DocumentClient().get", () => {
    const mockConfig = {};
    const { mockAWS, mockedFunctions } = mockAWSLib();
    const table = new Table({ config: mockConfig, AWS: mockAWS });
    table.get("hashKey", "sortKey");
    expect(mockedFunctions.get).toHaveBeenCalled();
  });
});

describe("Table.get_config", () => {
  it("returns config", () => {
    const mockConfig = {};
    const { mockAWS, _ } = mockAWSLib();
    const table = new Table({ config: mockConfig, AWS: mockAWS });
    expect(table.getConfig()).toEqual(mockConfig);
  });
});
