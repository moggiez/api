exports.map = (dynamoDbItem) => {
  return {
    CustomerId: dynamoDbItem.CustomerId.S,
    PlaybookId: dynamoDbItem.PlaybookId.S,
    Playbook: JSON.parse(dynamoDbItem.Playbook.S),
  };
};
