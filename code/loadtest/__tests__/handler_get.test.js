const uuid = require("uuid");
const { Handler } = require("../handler");
const { mockTable, getPromiseWithReturnValue } = require("./helpers");

const { Table } = require("moggies-db");
jest.mock("moggies-db");

const response = jest.fn();

describe("Handler.get", () => {
  beforeEach(() => {
    Table.mockClear();
  });

  it("returns 500 when db returns undefined", async () => {
    const table = mockTable();
    table.get.mockReturnValue(getPromiseWithReturnValue(undefined));
    const handler = new Handler(table);

    const orgId = uuid.v4();
    const loadtestId = uuid.v4();
    await handler.get(orgId, loadtestId, response);

    expect(table.get).toHaveBeenCalledWith(orgId, loadtestId);
    expect(response).toHaveBeenCalledWith(500, expect.any(Object));
  });

  it("returns 500 when db returns null", async () => {
    const table = mockTable();
    table.get.mockReturnValue(getPromiseWithReturnValue(null));
    const handler = new Handler(table);

    const orgId = uuid.v4();
    const loadtestId = uuid.v4();
    await handler.get(orgId, loadtestId, response);

    expect(table.get).toHaveBeenCalledWith(orgId, loadtestId);
    expect(response).toHaveBeenCalledWith(500, expect.any(Object));
  });

  it("calls dynamo get when hashKey and rangeKey passed", async () => {
    const dbItems = [];
    const table = mockTable();
    table.get.mockReturnValue(getPromiseWithReturnValue({ Items: [] }));
    const handler = new Handler(table);

    const orgId = uuid.v4();
    const loadtestId = uuid.v4();
    await handler.get(orgId, loadtestId, response);

    expect(table.get).toHaveBeenCalledWith(orgId, loadtestId);
    expect(response).toHaveBeenCalledWith(200, { data: dbItems });
  });

  it("calls dynamo get when hashKey passed and rangeKey is null", async () => {
    const dbItems = [];
    const table = mockTable();
    table.getByPartitionKey.mockReturnValue(
      getPromiseWithReturnValue({ Items: dbItems })
    );
    const handler = new Handler(table);

    const orgId = uuid.v4();
    await handler.get(orgId, null, response);

    expect(table.getByPartitionKey).toHaveBeenCalledWith(orgId);
    expect(response).toHaveBeenCalledWith(200, { data: dbItems });
  });

  it("calls dynamo get when hashKey passed and rangeKey is undefined", async () => {
    const dbItems = [];
    const table = mockTable();
    table.getByPartitionKey.mockReturnValue(
      getPromiseWithReturnValue({ Items: dbItems })
    );
    const handler = new Handler(table);

    const orgId = uuid.v4();
    await handler.get(orgId, undefined, response);

    expect(table.getByPartitionKey).toHaveBeenCalledWith(orgId);
    expect(response).toHaveBeenCalledWith(200, { data: dbItems });
  });

  it("returns 200 with items", async () => {
    const dbItems = [];
    const table = mockTable();
    table.getByPartitionKey.mockReturnValue(
      getPromiseWithReturnValue({ Items: dbItems })
    );
    const handler = new Handler(table);

    const orgId = uuid.v4();
    await handler.get(orgId, undefined, response);

    expect(table.getByPartitionKey).toHaveBeenCalledWith(orgId);
    expect(response).toHaveBeenCalledWith(200, { data: dbItems });
  });

  it("returns 200 with a single item", async () => {
    const dbItem = {};
    const table = mockTable();
    table.getByPartitionKey.mockReturnValue(
      getPromiseWithReturnValue({ Item: dbItem })
    );
    const handler = new Handler(table);

    const orgId = uuid.v4();
    await handler.get(orgId, undefined, response);

    expect(table.getByPartitionKey).toHaveBeenCalledWith(orgId);
    expect(response).toHaveBeenCalledWith(200, dbItem);
  });
});
