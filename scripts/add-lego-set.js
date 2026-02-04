const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const yaml = require('js-yaml');
const https = require('https');

const setId = process.argv[2];
if (!setId) {
  console.error('Usage: npm run add-lego-set <setId>');
  process.exit(1);
}

const csvPath = path.join(__dirname, '..', 'content', 'db', 'lego-starwars.csv');
let found = null;

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => {
    if (row.Number === setId) {
      found = row;
    }
  })
  .on('end', () => {
    if (!found) {
      console.error(`Set ${setId} not found in CSV.`);
      process.exit(1);
    }

    // Parse exit date
    const exitDateStr = found.ExitDate;
    const exitDate = exitDateStr ? new Date(exitDateStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')) : null;
    const isRetired = exitDate && new Date() > exitDate;

    // Slugify name for id and filename
    const slugifiedName = slugify(found.SetName);

    const yamlData = {
      id: `lego-${slugifiedName}-${found.Number}`,
      name: found.SetName,
      category: 'lego',
      status: 'wishlist',
      isGift: false,
      tags: [found.Theme, found.Subtheme].filter(Boolean),
      retailPrice: parseFloat(found.DERetailPrice) || 0,
      purchasePrice: '',
      storeUrl: `https://www.lego.com/en-de/product/${slugifiedName}-${found.Number}`,
      notes: '',
      images: [`lego/${found.Number}.jpg`],
      dateAdded: new Date().toISOString().split('T')[0],
      dateBought: '',
      setId: found.Number,
      partCount: parseInt(found.Pieces) || 0,
      isRetired: isRetired,
      minifigCount: parseInt(found.Minifigs) || 0,
      yearReleased: parseInt(found.YearFrom) || 0
    };

    const yamlStr = yaml.dump(yamlData, { indent: 2 });
    const fileName = `${slugifiedName}-${found.Number}.yaml`;
    const filePath = path.join(__dirname, '..', 'content', 'items', 'lego', fileName);

    fs.writeFileSync(filePath, yamlStr);
    console.log(`Created ${filePath}`);

    // Download image
    const imageUrl = `https://images.brickset.com/sets/images/${found.ImageFilename}.jpg`;
    const imagePath = path.join(__dirname, '..', 'static', 'images', 'lego', `${found.Number}.jpg`);

    https.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed to download image: ${res.statusCode}`);
        return;
      }
      const fileStream = fs.createWriteStream(imagePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        console.log(`Downloaded image to ${imagePath}`);
      });
      fileStream.on('error', (err) => {
        console.error('Error writing image:', err);
      });
    }).on('error', (err) => {
      console.error('Error downloading image:', err);
    });
  });

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}