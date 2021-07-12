const mockAWSLib = () => {
  const mockGet = jest.fn();
  const mockQuery = jest.fn();
  const mockPut = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockConstructor = jest.fn();

  const mockDocClient = class C {
    constructor(options) {
      mockConstructor(options);
    }
    get = mockGet;
    query = mockQuery;
    put = mockPut;
    update = mockUpdate;
    delete = mockDelete;
  };

  const mockAWS = {
    DynamoDB: {
      DocumentClient: mockDocClient,
    },
  };

  return {
    mockAWS,
    mockedFunctions: {
      documentClientConstructor: mockConstructor,
      get: mockGet,
      query: mockQuery,
      put: mockPut,
      update: mockUpdate,
      delete: mockDelete,
    },
  };
};

exports.mockAWSLib = mockAWSLib;
