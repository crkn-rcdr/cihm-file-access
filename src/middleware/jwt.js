const unless = require('koa-unless');
const nJwt = require('njwt');

module.exports = (opts) => {
  const middleware = async function jwt(ctx, next) {
    let keyId;
    let token;

    if (ctx.headers.authorization) {
      let headerMatch = ctx.headers.authorization.match(
        /^C7A2 Key=(.+),Token=(.+)$/i
      );

      [keyId, token] = [headerMatch[1], headerMatch[2]];
    } else {
      keyId = ctx.query['key'];
      token = ctx.query['token'];
    }

    if (!keyId && !token) {
      ctx.throw(401, `File access requires a signed JWT in the Authorization header, in the form

Authorization: C7A2 Key=$key,Token=$jwt

Alternatively, the key and JWT can be provided in the query string

?key=$key&token=$token`);
    }

    let signingKey = ctx.config.secrets[keyId];

    if (!signingKey) {
      ctx.throw(401, `Unknown key id ${keyId}`);
    }

    let jwtData;
    try {
      jwtData = nJwt.verify(token, signingKey).body;
    } catch (err) {
      ctx.throw(401, err.message);
    }

    let [, uid, ...filePath] = ctx.path.split('/');
    filePath = filePath.join('/');

    if (jwtData.uids) {
      let uidMatches = (new RegExp(jwtData.uids)).test(uid);
      if (!uid || !uidMatches) {
        ctx.throw(403, `Access denied to ${uid}`);
      }
    }

    if (jwtData.files) {
      let fileMatches = new RegExp(jwtData.files).test(filePath);
      if (!filePath || !fileMatches) {
        ctx.throw(403, `Access denied to ${uid}/${filePath}`);
      }
    }

    return next();
  };

  middleware.unless = unless;
  return middleware;
};
