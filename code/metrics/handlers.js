const AWS = require("aws-sdk");
const uuid = require("uuid");
const config = require("./config");

const CloudWatch = new AWS.CloudWatch({ apiVersion: "2010-08-01" });
const getParams = () => {
  const customerId = "default";
  const loadtestId = "0255f23e-7e38-479b-8b09-dfb7d5526348";
  return {
    MetricDataQueries: [
      {
        Id: "myrequest",
        MetricStat: {
          Metric: {
            Dimensions: [
              {
                Name: "CUSTOMER",
                Value: customerId,
              },
              {
                Name: "LOADTEST_ID",
                Value: loadtestId,
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
            MetricName: "MOGGIEZ_RESPONSE_TIME",
            Namespace: `MOGGIEZ/${customerId}/${loadtestId}`,
          },
          Period: 1, // every second
          Stat: "Average",
          Unit: "Milliseconds",
        },
        ReturnData: true,
      },
    ],
    StartTime: new Date("2021-05-29T13:33:58.339Z").toISOString(),
    EndTime: new Date("2021-05-29T13:34:58.339Z").toISOString(),
    ScanBy: "TimestampAscending",
  };
};

const getMetricsData = () => {
  return new Promise((resolve, reject) => {
    CloudWatch.getMetricData(getParams(), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.get = (response) => {
  getMetricsData()
    .then((data) => response(200, data, config.headers))
    .catch((err) => response(500, err, config.headers));
};
