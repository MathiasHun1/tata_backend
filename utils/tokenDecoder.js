const jwt = require("jsonwebtoken");

const tokenExtractor = (request) => {
  const authorization = request.get("authorization");
  let token;
  try {
    if (authorization.startsWith("Bearer")) {
      token = authorization.replace("Bearer ", "");
    }
  } catch (error) {
    token = null;
  }
  return token;
};

const tokenDecoder = (request) => {
  const token = tokenExtractor(request);
  if (!token) return false;

  try {
    jwt.verify(tokenExtractor(request), process.env.SECRET);
    return true;
  } catch (error) {
    if (error) {
      return false;
    }
  }
};

module.exports = tokenDecoder;
