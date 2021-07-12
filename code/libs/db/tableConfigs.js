const defaultMapper = {
  map: (dynamoDbItem) => {
    return dynamoDbItem;
  },
};

exports.tableConfigs = {
  loadtests: {
    tableName: "loadtests",
    hashKey: "OrganisationId",
    sortKey: "LoadtestId",
    indexes: {
      PlaybookLoadtestIndex: {
        hashKey: "PlaybookId",
        sortKey: "LoadtestId",
      },
      UsersLoadtestsIndex: {
        hashKey: "UserId",
        sortKey: "LoadtestId",
      },
      CreatedAtHourIndex: {
        hashKey: "CreatedAtHour",
        sortKey: "MetricsSavedDate",
      },
    },
  },
  playbooks: {
    tableName: "playbooks",
    hashKey: "OrganisationId",
    sortKey: "PlaybookId",
  },
  playbook_versions: {
    tableName: "playbook_versions",
    hashKey: "PlaybookId",
    sortKey: "Version",
    indexes: {
      OrganisationPlaybooks: {
        hashKey: "OrganisationId",
        sortKey: "PlaybookId",
      },
    },
  },
  organisations: {
    tableName: "organisations",
    hashKey: "OrganisationId",
    sortKey: "UserId",
    indexes: {
      UserOrganisations: {
        hashKey: "UserId",
        sortKey: "OrganisationId",
      },
    },
  },
  domains: {
    tableName: "domains",
    hashKey: "OrganisationId",
    sortKey: "DomainName",
    mapper: defaultMapper,
  },
  loadtest_metrics: {
    tableName: "loadtest_metrics",
    hashKey: "LoadtestId",
    sortKey: "MetricName",
  },
};
