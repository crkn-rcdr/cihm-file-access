const unless = require('koa-unless');
const mime = require('mime-types');
const TDR = require('../tdr');

const tdrObj = new TDR();

module.exports = (repositories) => {
  const middleware = async function tdr(ctx, next) {
    let path = await tdrObj.path(repositories, ctx.path);
    if (path) {
      ctx.set('X-Sendfile', path);
      ctx.body = '';
      ctx.type = mime.lookup(path);
    } else {
      ctx.throw(404, 'File not found.');
    }

    return next();
  }

  middleware.unless = unless;
  return middleware;
}
