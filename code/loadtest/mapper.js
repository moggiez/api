exports.map = (dynamoDbItem) => {
  return {
    CustomerId: dynamoDbItem.CustomerId.S,
    LoadtestId: dynamoDbItem.LoadtestId.S,
    PlaybookId: dynamoDbItem.PlaybookId.S,
  };
};
