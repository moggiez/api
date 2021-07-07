class Metrics {
  constructor(cloudWatchApi) {
    this.CloudWatch = cloudWatchApi;
  }

  generateGetMetricsDataParamsForLoadtest(loadtest, metricName) {
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
                  Value: loadtest.UserId,
                },
              ],
              MetricName: metricName,
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
  }

  getMetricsData(params) {
    return new Promise((resolve, reject) => {
      console.log(JSON.stringify(params));
      this.CloudWatch.getMetricData(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}

exports.Metrics = Metrics;
