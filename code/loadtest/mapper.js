exports.map = (dynamoDbItem) => {
  return {
    OrganisationId: dynamoDbItem.OrganisationId.S,
    LoadtestId: dynamoDbItem.LoadtestId.S,
    PlaybookId: dynamoDbItem.PlaybookId.S,
  };
};
