const { readdir, readFile, writeFile } = require('fs/promises');
const { join, extname } = require('path');
const stylesDir = join(__dirname, 'styles');
const projectDist = join(__dirname, 'project-dist');

async function getStyleFiles() {
  try {
    const files = await readdir(stylesDir, { withFileTypes: true });
    return files.filter((file) => extname(file.name) === '.css');
  } catch (error) {
    console.error('Error getting styles: ' + error.message);
  }
}

async function readFiles() {
  try {
    const styles = await getStyleFiles();
    const fileContentsPromises = styles.map((style) =>
      readFile(join(stylesDir, style.name)),
    );
    const fileContents = await Promise.all(fileContentsPromises);
    return fileContents.map((data) => data.toString());
  } catch (error) {
    console.error('Error getting file content: ' + error.message);
  }
}

async function createBundle() {
  try {
    const fileContents = await readFiles();
    const bundleContent = fileContents.join('\n');
    await writeFile(join(projectDist, 'bundle.css'), bundleContent);
  } catch (error) {
    console.error('Error creating bundle: ', error.message);
  }
}

createBundle();
