const unless = require('koa-unless');
const TDR = require('../tdr');

const tdrObj = new TDR();

module.exports = (opts = {}) => {
  const middleware = async function tdr(ctx, next) {
    let path = await tdrObj.path(ctx.config.repositories, ctx.path);
    if (path) {
      ctx.set('X-Sendfile', path);
      ctx.body = { path };
    } else {
      ctx.throw(404, 'File not found.');
    }

    return next();
  }

  middleware.unless = unless;
  return middleware;
}
