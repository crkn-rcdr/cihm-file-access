const fs = require('fs');
const Koa = require('koa');
const cors = require('kcors');
const onerror = require('koa-onerror');
const jwt = require('cihm-jwt');
const fileJwt = require('./middleware/fileJwt');
const tdr = require('./middleware/tdr');

const app = new Koa();

const config = require(process.env.APP_CONFIG || '../config');
config.repositories = fs.readdirSync(config.repositoryBase).map((directory) => {
  return `${config.repositoryBase}/${directory}`;
})

onerror(app);

app.use(cors({ origin: '*' }));

app.use(jwt(config.secrets));
app.use(fileJwt());
app.use(tdr(config.repositories));

app.listen(3000);
