const Koa = require('koa');
const http = require('http');
const request = require('supertest');
const nJwt = require('njwt');

const secrets = require('../../../test/config').secrets;

let jwts = {
  full: nJwt.create({ iss: 1 }, secrets[1]),
  oocihmOnly: nJwt.create({ iss: 1, uids: '^oocihm\.' }, secrets[1]),
  txtOnly: nJwt.create({ iss: 1, files: '\.txt$' }, secrets[1])
};

const jwt = require('cihm-jwt');
const fileJwt = require('../fileJwt');

const app = new Koa();

app.use(jwt(secrets));
app.use(fileJwt());

// let's assume for testing purposes that credentialed requests get 200
app.use(ctx => { ctx.status = 200; });

it('validates full credentials', () => {
  return request(http.createServer(app.callback()))
    .get('/foo')
    .set('Authorization', `C7A2 ${jwts.full.compact()}`)
    .expect(200);
});

it('validates uid-specific credentials', () => {
  return request(http.createServer(app.callback()))
    .get('/oocihm.01096/foo.txt')
    .set('Authorization', `C7A2 ${jwts.oocihmOnly.compact()}`)
    .expect(200);
});

it('rejects uid-specific credentials', () => {
  return request(http.createServer(app.callback()))
    .get('/ooe.19191/foo.txt')
    .set('Authorization', `C7A2 ${jwts.oocihmOnly.compact()}`)
    .expect(403);
});

it('validates file-specific credentials', () => {
  return request(http.createServer(app.callback()))
    .get('/oocihm.01096/foo.txt')
    .set('Authorization', `C7A2 ${jwts.txtOnly.compact()}`)
    .expect(200);
});

it('rejects file-specific credentials', () => {
  return request(http.createServer(app.callback()))
    .get('/ooe.19191/foo.pdf')
    .set('Authorization', `C7A2 ${jwts.txtOnly.compact()}`)
    .expect(403);
});
