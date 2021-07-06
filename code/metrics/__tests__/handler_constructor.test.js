const { Handler } = require("../handler");
const { mockTable, mockMetrics } = require("./helpers");

describe("Handler.constructor", () => {
  it("should raise exception when table is not domains", () => {
    const organisations = mockTable({ tableName: "unknown" });
    const loadtests = mockTable({ tableName: "loadtests" });
    const loadtestMetrics = mockTable({ tableName: "loadtest_metrics" });
    const Metrics = mockMetrics();
    expect(
      () => new Handler({ organisations, loadtests, loadtestMetrics, Metrics })
    ).toThrow(
      "Constructor expects 'organisations' table passed. The passed table name does not match 'organisations'."
    );
  });

  it("should raise exception when organisations is undefined", () => {
    const loadtests = mockTable({ tableName: "loadtests" });
    const loadtestMetrics = mockTable({ tableName: "loadtest_metrics" });
    const Metrics = mockMetrics();
    expect(
      () =>
        new Handler({
          organisations: undefined,
          loadtests,
          loadtestMetrics,
          Metrics,
        })
    ).toThrow(
      "Constructor expects 'organisations' table passed. The passed table name does not match 'organisations'."
    );
  });
});
