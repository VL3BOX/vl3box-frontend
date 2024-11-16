const fs = require('fs');
const path = require('path');

basePath=__dirname + '/data'
function loadTranslations(locale, type) {
  const filePath = path.join(__dirname, `${locale}.${type}.json`);
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading translation file: ${error}`);
    return {};
  }
}

function replaceI18nInFile(key, filePath, translations) {
  try {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Get the translations for this specific file
    const fileTranslations = translations[key] || {};

    // Replace all occurrences of each key with its translation
    for (const [key, value] of Object.entries(fileTranslations)) {
      const regex = new RegExp(key, 'g');
      content = content.replace(regex, value);
    }

    // Write the modified content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Translations applied to ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error}`);
  }
}

function processFiles(locale,type) {
  const translations = loadTranslations(locale,type);

  // Get the list of files from the keys of the translations object
  const files = Object.keys(translations);

  files.forEach(file => {
    const fullPath = path.join(`./${type}`, file);
    if (fs.existsSync(fullPath)) {
      replaceI18nInFile(file, fullPath, translations);
    } else {
      console.warn(`File not found: ${fullPath}`);
    }
  });
}

// Run the script
processFiles('vi_VN','apps');
processFiles('vi_VN','packages');