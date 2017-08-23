const unless = require('koa-unless');
const nJwt = require('njwt');

module.exports = (opts) => {
  const middleware = async function jwt(ctx, next) {
    let token;

    if (ctx.headers.authorization) {
      let headerMatch = ctx.headers.authorization.match(
        /^C7A2 (.+)$/i
      );

      [token] = [headerMatch[1]];
    } else {
      token = ctx.query['token'];
    }

    if (!token) {
      ctx.throw(401, `File access requires a signed JWT in the Authorization header, in the form

Authorization: C7A2 $jwt

Alternatively, the JWT can be provided in the query string

?token=$token`);
    }

    let validatedIssuer, jwtData;
    for (issuer of Object.keys(ctx.config.secrets)) {
      try {
        jwtData = nJwt.verify(token, ctx.config.secrets[issuer]).body;
        validatedIssuer = issuer;
        break;
      } catch (err) {
      }
    }

    if (!jwtData) {
      ctx.throw(401, `Could not verify JWT`);
    }

    if (jwtData.iss != validatedIssuer) {
      ctx.throw(401, `Validated issuer ${validatedIssuer} does not match JWT 'iss' claim`);
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
