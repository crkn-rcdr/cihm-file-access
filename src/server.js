const Koa = require('koa');
const cors = require('kcors');
const onerror = require('koa-onerror');
const jwt = require('./middleware/jwt');
const tdr = require('./middleware/tdr');

const app = new Koa();
app.context.config = require(process.env.APP_CONFIG || '../config')

onerror(app);

app.use(cors({ origin: '*' }));

app.use(jwt());
app.use(tdr());

app.listen(3000);
