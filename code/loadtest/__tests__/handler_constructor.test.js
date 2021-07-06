const { Handler } = require("../handler");
const { mockTable } = require("./helpers");

describe("Handler.constructor", () => {
  it("should raise exception when table is not domains", () => {
    const table = mockTable({ tableName: "unknown" });
    expect(() => new Handler(table)).toThrow(
      "Constructor expects 'loadtests' table passed. The passed table name does not match 'loadtests'."
    );
  });

  it("shouldn't raise excepttion when table is domains", () => {
    const table = mockTable({ tableName: "loadtests" });
    expect(() => new Handler(table)).not.toThrow();
  });
});
