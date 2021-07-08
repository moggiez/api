const uuid = require("uuid");
const { Handler } = require("../handler");
const { buildLambdaRequest, mockTable } = require("./helpers");
const helpers = require("moggies-lambda-helpers");
const auth = require("moggies-auth");

const { Table } = require("moggies-db");
jest.mock("moggies-db");

const response = jest.fn();

describe("Handler.handle", () => {
  beforeEach(() => {
    Table.mockClear();
  });

  it("calls this.get when httpMethod is GET", () => {
    const orgId = uuid.v4();
    const loadtestId = uuid.v4();
    const event = buildLambdaRequest(
      "GET",
      "/loadtest",
      `${orgId}/${loadtestId}`,
      {
        TestField: 1,
      }
    );
    const user = auth.getUserFromEvent(event);
    const request = helpers.getRequestFromEvent(event);
    request.user = user;

    const handler = new Handler(mockTable());
    handler.get = jest.fn();

    handler.handle(request, response);

    expect(handler.get).toHaveBeenCalledWith(orgId, loadtestId, response);
  });

  it("calls this.post when httpMethod is POST", () => {
    const orgId = uuid.v4();
    const payload = {
      TestField: 1,
    };
    const event = buildLambdaRequest("POST", "/loadtest", `${orgId}`, payload);
    const user = auth.getUserFromEvent(event);
    const request = helpers.getRequestFromEvent(event);
    request.user = user;

    const handler = new Handler(mockTable());
    handler.post = jest.fn();

    handler.handle(request, response);

    expect(handler.post).toHaveBeenCalledWith(
      orgId,
      { ...payload, UserId: request.user.id },
      response
    );
  });

  it("calls this.delete when httpMethod is DELETE", () => {
    const orgId = uuid.v4();
    const loadtestId = uuid.v4();
    const payload = {
      TestField: 1,
    };
    const event = buildLambdaRequest("DELETE", "/loadtest", `${orgId}/${loadtestId}`, payload);
    const user = auth.getUserFromEvent(event);
    const request = helpers.getRequestFromEvent(event);
    request.user = user;

    const handler = new Handler(mockTable());
    handler.delete = jest.fn();

    handler.handle(request, response);

    expect(handler.delete).toHaveBeenCalledWith(
      orgId,
      loadtestId,
      response
    );
  });
});
