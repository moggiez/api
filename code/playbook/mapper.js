exports.map = (dynamoDbItem) => {
  return {
    OrganisationId: dynamoDbItem.OrganisationId.S,
    PlaybookId: dynamoDbItem.PlaybookId.S,
    Playbook: JSON.parse(dynamoDbItem.Playbook.S),
  };
};
