const AWS = require("aws-sdk");
const db = require("db");
const config = require("./config");

const organisations = new db.Table(db.tableConfigs.organisations);
const loadtests = new db.Table(db.tableConfigs.loadtests);
const loadtest_metrics = new db.Table(db.tableConfigs.loadtest_metrics);
const CloudWatch = new AWS.CloudWatch({ apiVersion: "2010-08-01" });

const getLoadtest = (user, loadtestId) => {
  return new Promise((resolve, reject) => {
    organisations
      .getBySecondaryIndex("UserOrganisations", user.id)
      .then((orgData) => {
        if (orgData.Items.length == 0) {
          reject("Organisation not found.");
        } else {
          const orgId = orgData.Items[0].OrganisationId;
          loadtests
            .get(orgId, loadtestId)
            .then((loadtestData) => {
              resolve(loadtestData.Item);
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        }
      })
      .catch((err) => {
        console.log("Unable to fetch user organisations.", err);
        reject(err);
      });
  });
};

const getParams = (loadtest) => {
  const startDate = new Date(loadtest.StartDate);
  let endDate = new Date(loadtest.UpdatedAt);
  const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  if (seconds < 60) {
    endDate.setSeconds(endDate.getSeconds() + 300);
  }

  return {
    MetricDataQueries: [
      {
        Id: "myrequest",
        MetricStat: {
          Metric: {
            Dimensions: [
              {
                Name: "CUSTOMER",
                Value: loadtest.OrganisationId,
              },
              {
                Name: "LOADTEST_ID",
                Value: loadtest.LoadtestId,
              },
              {
                Name: "STATUS",
                Value: "200",
              },
              {
                Name: "USER_ID",
                Value: "de3150ab-ce1b-497b-9333-41420cde9091",
              },
            ],
            MetricName: "ResponseTime",
            Namespace: `moggies.io/Loadtests`,
          },
          Period: 1, // every second
          Stat: "Average",
          Unit: "Milliseconds",
        },
        ReturnData: true,
      },
    ],
    StartTime: startDate.toISOString(),
    EndTime: endDate.toISOString(),
    ScanBy: "TimestampAscending",
  };
};

const getMetricsData = (loadtest) => {
  return new Promise((resolve, reject) => {
    const params = getParams(loadtest);
    console.log(JSON.stringify(params));
    CloudWatch.getMetricData(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.get = (user, loadtestId, response) => {
  getLoadtest(user, loadtestId)
    .then((data) => {
      if (data) {
        getMetricsData(data)
          .then((data) => response(200, data, config.headers))
          .catch((err) => response(500, err, config.headers));
      } else {
        response(401, "Unauthorized", config.headers);
      }
    })
    .catch((err) => {
      console.log(err);
      response(401, "Unauthorized", config.headers);
    });
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
