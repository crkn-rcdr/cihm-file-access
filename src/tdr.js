const fs = require('fs');
const crc = require('crc');

module.exports = class TDR {
  hash(id) {
    return crc.crc32(id).toString().slice(-3);
  }

  basepath(repositories, id) {
    let hash = this.hash(id);
    let [depositor, objid] = id.split('.');
    for (let repo of repositories) {
      let path = [repo, depositor, hash, id].join('/');
      try {
        if (fs.statSync(path).isDirectory()) {
          return path;
        }
      } catch (e) {
        if (e.code !== 'ENOENT') {
          throw e;
        }
      }
    }
    return '';
  }

  async path(repositories, input) {
    if (input.indexOf('/') === 0) {
      input = input.slice(1);
    }
    let [aip, ...filepath] = decodeURIComponent(input).split('/');
    filepath = filepath.join('/');
    let base = this.basepath(repositories, aip);
    if (base && filepath.indexOf('.') !== 0) {
      let path = [base, filepath].join('/');
      let fileStats;
      try {
        fileStats = fs.statSync(path);
      } catch (e) {
        if (e.code !== 'ENOENT') {
          throw e;
        } else {
          return '';
        }
      }
      return fileStats.isDirectory() ? '' : path;
    } else {
      return '';
    }
  }
}
