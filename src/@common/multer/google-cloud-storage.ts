import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { join } from 'path';
import { ConfigService } from '@nestjs/config'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'atg-storage',
  keyFilename: join(__dirname, '../../../src/@common', 'atg-storage-6db5ababc632.json')
});

const configService = new ConfigService()
console.log('gcs', configService.get('gcs.bucket'))
const bucket = storage.bucket('atg-staging');

export default class MulterGoogleCloudStorage {

  private options;
  private path

  constructor( options?: { acl?: string }, path?: string ) {
    options = options || {};
    this.path = path
  }

  getFilename(req, file, cb) {
    cb(null, `${this.path}/${randomStringGenerator()}_${file.originalname}`);
  }

  getDestination(req, file, cb) {
    cb(null, '')
  }

  _handleFile = (req, file, cb) => {
    this.getDestination(req, file, (err, path) => {
      if (err) return cb(err)

      this.getFilename(req, file, (err, filename) => {
        if (err) return cb(err);

        const gcFile = bucket.file(filename);

        file.stream.pipe(
          gcFile.createWriteStream({ predefinedAcl: this.options }))
          .on('error', (err) => cb(err))
          .on('finish', (file) => cb(null, {
            path: `https://${bucket.name}.storage.googleapis.com/${filename}`,
            filename: filename
          })
          );
      });

    })
  }

  _removeFile = (req, file, cb) => removeFile(file.filename)
}

export const removeFile = (filename) => {
  bucket.file(filename).delete();
}