const Koa = require('koa');
const http = require('http');
const request = require('supertest');

const tdr = require('../tdr');

const app = new Koa();
app.context.config = require('../../../test/config.js');
app.use(tdr());

it('sets X-Sendfile when given a valid path', () => {
  return request(http.createServer(app.callback()))
    .get('/oocihm.01096/foo.txt')
    .expect(200)
    .expect('X-Sendfile', /oocihm\/000\/oocihm\.01096\/foo\.txt/);
});

it('sets Content-Type to the file\'s mime type', () => {
  return request(http.createServer(app.callback()))
    .get('/oocihm.01096/foo.txt')
    .expect('Content-Type', /text\/plain/);
});

it('throws 404 when given a bad path', () => {
  return request(http.createServer(app.callback()))
    .get('/oocihm.01096/data/sip/data/files/notafile.txt')
    .expect(404);
});
