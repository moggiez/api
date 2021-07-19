const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

exports.getResponseFn = (callback) => {
  return (status, body, headers) => {
    const httpResponse = {
      statusCode: status,
      body: JSON.stringify(body),
      headers: headers ?? defaultHeaders,
    };
    callback(null, httpResponse);
  };
};

exports.getRequestFromEvent = (event) => {
  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  const pathParams =
    pathParameters != null && "proxy" in pathParameters && pathParameters.proxy
      ? pathParameters.proxy.split("/")
      : [];

  const getPathParamAtIndex = (index, defaultValue) => {
    return pathParams.length > index ? pathParams[index] : defaultValue;
  };

  return {
    httpMethod: httpMethod,
    body: JSON.parse(event.body),
    pathParameters: event.pathParameters,
    getPathParamAtIndex: getPathParamAtIndex,
  };
};
