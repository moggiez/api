const AWS = require("aws-sdk");
const db = require("moggies-db");
const config = require("./config");
const metricsHelpers = require("moggies-metrics");

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

const getFromDB = async (loadtestId, metricName) => {
  try {
    const loadtestMetricsData = await loadtest_metrics.get(
      loadtestId,
      metricName
    );
    if (loadtestMetricsData && "Item" in loadtestMetricsData) {
      return loadtestMetricsData.Item;
    } else {
      return null;
    }
  } catch (exc) {
    console.log(exc);
    throw new Error(exc);
  }
};

const getFromCW = async (loadtest, metricName) => {
  try {
    const params = Metrics.generateGetMetricsDataParamsForLoadtest(
      loadtest,
      metricName
    );
    const metricsData = await Metrics.getMetricsData(params);
    metricsData["Source"] = "CW";
    return metricsData;
  } catch (exc2) {
    console.log(exc2);
    throw new Error(exc2);
  }
};

exports.get = async (user, loadtestId, metricName, response) => {
  try {
    const data = await getLoadtest(user, loadtestId);
    if (!data) {
      response(401, "Unauthorized");
    }

    try {
      const fromDB = await getFromDB(loadtestId, metricName);
      if (fromDB == null) {
        const fromCW = await getFromCW(data, metricName);
        console.log("returned from CW");
        response(200, fromCW);
      } else {
        console.log("returned from DB");
        response(200, { ...fromDB.MetricsData, UpdatedAt: fromDB.UpdatedAt });
      }
    } catch (exc) {
      console.log(exc);
      response(500, "Internal server error.");
    }
  } catch (errGetLoadtest) {
    console.log(errGetLoadtest);
    response(401, "Unauthorized");
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
