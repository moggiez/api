const AWS = require("aws-sdk");
const db = require("db");
const config = require("./config");
const metricsHelpers = require("metrics");

const organisations = new db.Table(db.tableConfigs.organisations);
const loadtests = new db.Table(db.tableConfigs.loadtests);
const loadtest_metrics = new db.Table(db.tableConfigs.loadtest_metrics);
const CloudWatch = new AWS.CloudWatch({ apiVersion: "2010-08-01" });
const Metrics = new metricsHelpers.Metrics(CloudWatch);

const getLoadtest = async (user, loadtestId) => {
  const orgData = await organisations.getBySecondaryIndex(
    "UserOrganisations",
    user.id
  );
  if (orgData.Items.length == 0) {
    throw new Error("Organisation not found.");
  } else {
    const orgId = orgData.Items[0].OrganisationId;
    const loadtestData = await loadtests.get(orgId, loadtestId);
    return loadtestData.Item;
  }
};

exports.get = async (user, loadtestId, response) => {
  try {
    const data = await getLoadtest(user, loadtestId);
    if (data) {
      try {
        const params = Metrics.generateGetMetricsDataParamsForLoadtest(
          data,
          "ResponseTime"
        );
        const metricsData = await Metrics.getMetricsData(params);
        console.log("metricsData", metricsData);
        response(200, metricsData, config.headers);
      } catch (exc2) {
        console.log(exc2);
        response(500, "Internal server error.", config.headers);
      }
    } else {
      response(401, "Unauthorized", config.headers);
    }
  } catch (exc) {
    console.log(exc);
    response(401, "Unauthorized" + exc, config.headers);
  }
};

exports.post = async (user, loadtestId, metricName, data, response) => {
  try {
    const orgData = await organisations.getBySecondaryIndex(
      "UserOrganisations",
      user.id
    );
    const orgId = orgData.Items[0].OrganisationId;
    const loadtestData = await loadtests.get(orgId, loadtestId);
    const loadtest = loadtestData.Item;
    if (loadtest && loadtest != null) {
      await loadtest_metrics.create(loadtestId, metricName, { Data: data });
      response(201, "Created", config.headers);
    }
  } catch (err) {
    console.log(err);
    response(500, "Internal server error", config.headers);
  }
};
