const { Handler } = require("../handler");
const { mockTable } = require("./helpers");

describe("Handler.constructor", () => {
  it("should raise exception when table is not domains", () => {
    const table = mockTable({ tableName: "unknown" });
    expect(() => new Handler(table)).toThrow(
      "Constructor expects 'domains' table passed. The passed table name does not match 'domains'."
    );
  });

  it("shouldn't raise excepttion when table is domains", () => {
    const table = mockTable({ tableName: "domains" });
    expect(() => new Handler(table)).not.toThrow();
  });
});
