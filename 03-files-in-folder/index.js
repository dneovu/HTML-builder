const fsPromises = require('fs/promises');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

async function readDirectoryFiles() {
  try {
    const files = await fsPromises.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(dirPath, file.name);

        try {
          const stats = await fsPromises.stat(filePath);
          const fileInfo = path.parse(file.name);
          const fileName = fileInfo.name;
          const fileExt = fileInfo.ext.replace('.', '');
          const fileSize = `${stats.size / 1024}kb`;
          console.log(`${fileName} - ${fileExt} - ${fileSize}`);
        } catch (err) {
          console.error(err);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
readDirectoryFiles();
