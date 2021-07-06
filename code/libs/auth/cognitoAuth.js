const getFakeAuth = () => {
  return {
    id: "fake-user-id",
    username: "test@moggies.io",
    email: "test@moggies.io",
    clientId: "local-env",
    verified: true,
  };
};

const getUserFromClaims = (event) => {
  const claims = event.requestContext.authorizer.claims;
  return {
    id: claims.sub,
    username: claims["cognito:username"],
    email: claims.email,
    clientId: claims.aud,
    verified: claims.email_verified,
  };
};

exports.getUserFromEvent = (event) => {
  let env = "prod";
  try {
    env = process.env.env;
  } catch (errEnv) {
    console.log("Unable to retrieve 'env'", err);
  }

  try {
    return env == "local" ? getFakeAuth() : getUserFromClaims(event);
  } catch (err) {
    return null;
  }
};
