import fs from 'fs';
// https://www.npmjs.com/package/jimp#module-build
import Jimp from 'jimp/es';
import path from 'path';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        `/tmp/filtered.${ Math.floor(Math.random() * 2000) }.jpg`;
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
export async function deleteLocalFiles() {
  const tempFolder = path.join(__dirname, 'tmp');

  await fs.readdir(tempFolder, async (readdirError, files) => {
    if (readdirError) {
      // tslint:disable-next-line: no-console
      console.error(`Could not read the contents of ${tempFolder}`, readdirError);
    }

    const filesDeletions = files
      .map((file) => path.resolve(tempFolder, file))
      .map((file) => fs.unlink(
        file,
        (unlinkError) => {
          if (unlinkError) {
            // tslint:disable-next-line: no-console
            console.error(`${ path.resolve(tempFolder, file) } could not be deleted.`);
          }
        },
      ));

    await Promise.all(filesDeletions);
  });
}
