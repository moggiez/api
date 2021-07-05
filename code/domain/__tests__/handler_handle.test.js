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
    const domainName = uuid.v4();
    const event = buildLambdaRequest(
      "GET",
      "/domain",
      `${orgId}/${domainName}`,
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

    expect(handler.get).toHaveBeenCalledWith(orgId, domainName, response);
  });

  it("calls this.post when httpMethod is POST", () => {
    const orgId = uuid.v4();
    const domainName = uuid.v4();
    const payload = {
      TestField: 1,
    };
    const event = buildLambdaRequest(
      "POST",
      "/domain",
      `${orgId}/${domainName}`,
      payload
    );
    const user = auth.getUserFromEvent(event);
    const request = helpers.getRequestFromEvent(event);
    request.user = user;

    const handler = new Handler(mockTable());
    handler.post = jest.fn();

    handler.handle(request, response);

    expect(handler.post).toHaveBeenCalledWith(
      orgId,
      domainName,
      { ...payload },
      response
    );
  });

  it("calls this.put when httpMethod is PUT", () => {
    const orgId = uuid.v4();
    const domainName = uuid.v4();
    const payload = {
      TestField: 1,
      NewField: uuid.v4(),
    };
    const event = buildLambdaRequest(
      "PUT",
      "/domain",
      `${orgId}/${domainName}`,
      payload
    );
    const user = auth.getUserFromEvent(event);
    const request = helpers.getRequestFromEvent(event);
    request.user = user;

    const handler = new Handler(mockTable());
    handler.put = jest.fn();

    handler.handle(request, response);

    expect(handler.put).toHaveBeenCalledWith(
      orgId,
      domainName,
      { ...payload },
      response
    );
  });

  it("calls this.delete when httpMethod is DELETE", () => {
    const orgId = uuid.v4();
    const domainName = uuid.v4();
    const event = buildLambdaRequest(
      "DELETE",
      "/domain",
      `${orgId}/${domainName}`,
      {}
    );
    const user = auth.getUserFromEvent(event);
    const request = helpers.getRequestFromEvent(event);
    request.user = user;

    const handler = new Handler(mockTable());
    handler.delete = jest.fn();

    handler.handle(request, response);

    expect(handler.delete).toHaveBeenCalledWith(orgId, domainName, response);
  });
});
