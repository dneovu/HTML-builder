const { mkdir, copyFile, readdir, unlink } = require('fs/promises');
const { join } = require('path');
const srcDir = join(__dirname, 'files');
const destDir = `${srcDir}-copy`;

async function copyDir(srcDir, destDir) {
  try {
    await mkdir(destDir, { recursive: true });

    const sourceFiles = await getFiles(srcDir);
    const copiedFiles = await copyFilesToDir(sourceFiles, destDir);
    await removeChangedFiles(copiedFiles, destDir);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getFiles(dir) {
  try {
    const files = await readdir(dir, { withFileTypes: true });
    return files.filter((file) => file.isFile());
  } catch (error) {
    console.error('Error getting files:', error.message);
  }
}

async function copyFilesToDir(files, destDir) {
  try {
    const copiedFiles = files.map(async (file) => {
      await copyFile(join(srcDir, file.name), join(destDir, file.name));
      return file.name;
    });
    return Promise.all(copiedFiles);
  } catch (error) {
    console.error('Error copying files:', error.message);
  }
}

async function removeChangedFiles(files, destDir) {
  try {
    const destFiles = await readdir(destDir);
    for (const destFile of destFiles) {
      if (!files.includes(destFile)) {
        await unlink(join(destDir, destFile));
      }
    }
  } catch (error) {
    console.error('Error removing changed files:', error.message);
  }
}

copyDir(srcDir, destDir);
