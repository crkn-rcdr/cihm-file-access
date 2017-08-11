const fs = require('fs');
const Koa = require('koa');
const cors = require('kcors');
const onerror = require('koa-onerror');
const jwt = require('./middleware/jwt');
const tdr = require('./middleware/tdr');

const app = new Koa();

app.context.config = require(process.env.APP_CONFIG || '../config');
let base = app.context.config.repositoryBase;
app.context.config.repositories = fs.readdirSync(base).map((directory) => {
  return `${base}/${directory}`;
})

onerror(app);

app.use(cors({ origin: '*' }));

app.use(jwt());
app.use(tdr());

app.listen(3000);
