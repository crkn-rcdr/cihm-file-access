const unless = require('koa-unless');

module.exports = () => {
  const middleware = async function jwt(ctx, next) {
    let jwtData = ctx.state.jwtData;

    if (!jwtData) {
      ctx.throw(401, `File access requires a signed JWT. See cihm-jwt for more.`)
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
