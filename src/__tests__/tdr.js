const repositories = require('../../test/config').repositories;
const TDR = require('../tdr');

let tdr = new TDR();

it('generates a CRC32 hash for aip ids', () => {
  expect(tdr.hash('oocihm.01096')).toBe('000');
});

it('generates a basepath to an extant aip', () => {
  expect(tdr.basepath(repositories, 'oocihm.01096')).toMatch(/oocihm\/000\/oocihm\.01096/);
});

it('returns an empty basepath when the aip does not exist', () => {
  expect(tdr.basepath(repositories, 'oocihm.notreal')).toBe('');
});

it('returns a full path to a file that exists', async () => {
  expect(await tdr.path(
    repositories, '/oocihm.01096/foo.txt'
  )).toMatch(
    /oocihm\/000\/oocihm\.01096\/foo\.txt/
  );
});

it('returns blank if the full path is a directory', async () => {
  expect(await tdr.path(
    repositories, '/oocihm.01096/'
  )).toBe('');
});

it('returns blank if the full path does not exist', async () => {
  expect(await tdr.path(
    repositories, '/oocihm.notreal/data/sip/data/files/notarealfile.txt'
  )).toBe('');
});
