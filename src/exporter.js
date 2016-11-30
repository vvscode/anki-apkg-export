const EXPORTED_METHODS = ['save', 'addMedia'];

export default class {
  constructor(db, zip) {
    this.db = db;
    this.zip = zip;
    this.media = [];

    EXPORTED_METHODS.forEach(methodName => this[methodName] = this[methodName].bind(this));
  }

  save(options) {
    const { zip, db, media } = this;
    const binaryArray = db.export();
    const mediaObj = media.reduce((prev, curr, idx) => {
      prev[idx] = curr.filename;
      return prev;
    }, {});

    zip.file('collection.anki2', new Buffer(binaryArray));
    zip.file('media', JSON.stringify(mediaObj));

    media.forEach((item, i) => zip.file(i, item.data));

    if (process.env.APP_ENV === 'browser') {
      return zip.generateAsync(Object.assign({}, { type: 'blob' }, options));
    } else {
      return zip.generateAsync(Object.assign({}, { type: 'nodebuffer', base64: false, compression: 'DEFLATE' }, options));
    }
  }

  addMedia(filename, data) {
    this.media.push({filename, data});
  }
}
