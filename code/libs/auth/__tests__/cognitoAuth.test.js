const { testEvent } = require("./helpers");
const { getUserFromEvent } = require("../cognitoAuth");

describe("cognitoAuth", () => {
  it("should set authorization when header present", () => {
    const user = getUserFromEvent(testEvent);
    expect(user).toHaveProperty(
      "authorization",
      testEvent.headers.Authorization
    );
  });

  it("should not set authorization when header not present", () => {
    const testEventUpdated = { ...testEvent };
    delete testEvent.headers.Authorization;
    const user = getUserFromEvent(testEvent);
    expect(user).not.toHaveProperty("authorization");
  });

  it("should set user claims from event", () => {
    const user = getUserFromEvent(testEvent);
    // id: claims.sub,
    // username: claims["cognito:username"],
    // email: claims.email,
    // clientId: claims.aud,
    // verified: claims.email_verified,
    expect(user).toHaveProperty(
      "authorization",
      testEvent.headers.Authorization
    );
  });
});
