const uuid = require("uuid");
const { Handler } = require("../handler");
const {
  mockTable,
  getPromiseWithReturnValue,
  getPromiseWithReject,
} = require("./helpers");

const { Table } = require("moggies-db");
jest.mock("moggies-db");

const response = jest.fn();

describe("Handler.post", () => {
  beforeEach(() => {
    Table.mockClear();
  });

  it("calls create on table", async () => {
    const table = mockTable();
    const orgId = uuid.v4();
    const domainName = uuid.v4();
    const payload = {};

    const returnValue = { test: uuid.v4() };
    table.create.mockReturnValue(getPromiseWithReturnValue(returnValue));

    const handler = new Handler(table);
    await handler.post(orgId, domainName, payload, response);

    expect(table.create).toHaveBeenCalledWith(orgId, expect.any(String), {});
    expect(response).toHaveBeenCalledWith(200, returnValue);
  });

  it("returns 500 when table throws an error", async () => {
    const table = mockTable();
    const orgId = uuid.v4();
    const domainName = uuid.v4();
    const payload = {};

    table.create.mockImplementation(() =>
      getPromiseWithReject("This is my error")
    );

    const handler = new Handler(table);
    await handler.post(orgId, domainName, payload, response);

    expect(table.create).toHaveBeenCalledWith(
      orgId,
      domainName,
      expect.any(Object)
    );
    expect(response).toHaveBeenCalledWith(500, "This is my error");
  });
});
