const {
  mkdir,
  rm,
  copyFile,
  readdir,
  readFile,
  writeFile,
} = require('fs/promises');
const { join, extname } = require('path');

const projectDist = join(__dirname, 'project-dist');
const srcAssets = join(__dirname, 'assets');
const distAssets = join(projectDist, 'assets');
const srcStyles = join(__dirname, 'styles');
const componentsPath = join(__dirname, 'components');
const templatePath = join(__dirname, 'template.html');

async function createHTMLBundle(componentsPath, templatePath, dest) {
  try {
    const components = await readdir(componentsPath, { withFileTypes: true });
    const htmlComponents = components.filter(
      (item) => extname(item.name) === '.html',
    );

    let template = (await readFile(templatePath)).toString();

    await Promise.all(
      htmlComponents.map(async (item) => {
        const nameInBrackets = `{{${item.name.replace(
          extname(item.name),
          '',
        )}}}`;
        const itemString = (
          await readFile(join(componentsPath, item.name))
        ).toString();
        if (template.includes(nameInBrackets)) {
          template = template.replaceAll(nameInBrackets, itemString);
        }
      }),
    );

    await writeFile(join(dest, 'index.html'), template);
  } catch (err) {
    console.error(err);
  }
}

async function createCSSBundle(src, dest) {
  try {
    const srcItems = await readdir(src, { withFileTypes: true });
    const srcStyles = await Promise.all(
      srcItems
        .filter((item) => extname(item.name) === '.css')
        .map(async (item) => (await readFile(join(src, item.name))).toString()),
    );
    await writeFile(join(dest, 'style.css'), srcStyles.join('\n'));
  } catch (err) {
    console.error(err);
  }
}

async function copyFilesRecursively(src, dest) {
  try {
    await rm(dest, { recursive: true, force: true });
    await mkdir(dest, { recursive: true });

    const srcItems = await readdir(src, { withFileTypes: true });
    await Promise.all(
      srcItems.map(async (item) => {
        const srcPath = join(src, item.name);
        const destPath = join(dest, item.name);

        item.isFile()
          ? await copyFile(srcPath, destPath)
          : await copyFilesRecursively(srcPath, destPath);
      }),
    );
    return srcItems;
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  await copyFilesRecursively(srcAssets, distAssets);
  await createCSSBundle(srcStyles, projectDist);
  await createHTMLBundle(componentsPath, templatePath, projectDist);
}

main();
