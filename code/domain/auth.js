exports.getUserFromEvent = (event) => {
  try {
    const claims = event.requestContext.authorizer.claims;
    return {
      id: claims.sub,
      username: claims["cognito:username"],
      email: claims.email,
      clientId: claims.aud,
      verified: claims.email_verified,
    };
  } catch (err) {
    return null;
  }
};
