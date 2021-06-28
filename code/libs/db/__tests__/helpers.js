const mockAWSLib = () => {
  const mockGet = jest.fn();
  const mockQuery = jest.fn();
  const mockPut = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  const mockDocClient = class C {
    get = mockGet;
    query = mockQuery;
    put = mockPut;
    update = mockUpdate;
    mockDelete = mockDelete;
  };

  const mockAWS = {
    DynamoDB: {
      DocumentClient: mockDocClient,
    },
  };

  return { mockAWS, mockedFunctions: { get: mockGet } };
};

exports.mockAWSLib = mockAWSLib;
