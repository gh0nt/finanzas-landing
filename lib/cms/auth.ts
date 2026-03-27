import crypto from "node:crypto";

export const CMS_COOKIE_NAME = "fsr_cms_session";

function getExpectedCredentials() {
  return {
    account: process.env.CMS_ACCOUNT,
    password: process.env.CMS_PASSWORD,
    secret: process.env.CMS_SESSION_SECRET,
  };
}

function signSession(account: string, password: string, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${account}:${password}`)
    .digest("hex");
}

export function validateCmsCredentials(account: string, password: string) {
  const expected = getExpectedCredentials();

  if (!expected.account || !expected.password) {
    return false;
  }

  return account === expected.account && password === expected.password;
}

export function createCmsSessionToken() {
  const expected = getExpectedCredentials();

  if (!expected.account || !expected.password || !expected.secret) {
    return null;
  }

  return signSession(expected.account, expected.password, expected.secret);
}

export function isValidCmsSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const expectedToken = createCmsSessionToken();

  if (!expectedToken) {
    return false;
  }

  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expectedToken);

  if (tokenBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(tokenBuffer, expectedBuffer);
}
