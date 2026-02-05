const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const yaml = require('js-yaml');

// Build a lookup map from the CSV
const csvPath = path.join(__dirname, '..', 'content', 'db', 'lego-starwars.csv');
const csvMap = new Map();

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => {
    const number = row.Number;
    if (number) {
      csvMap.set(number, row);
    }
  })
  .on('end', () => {
    console.log(`Loaded ${csvMap.size} sets from CSV`);

    // Get all YAML files
    const itemsDir = path.join(__dirname, '..', 'content', 'items', 'lego');
    const yamlFiles = fs.readdirSync(itemsDir).filter(f => f.endsWith('.yaml'));

    console.log(`Found ${yamlFiles.length} YAML files to migrate`);

    let migrated = 0;
    let skipped = 0;

    yamlFiles.forEach((fileName) => {
      const filePath = path.join(itemsDir, fileName);
      const content = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(content);

      if (!data || !data.setId) {
        console.log(`Skipping ${fileName}: no setId`);
        skipped++;
        return;
      }

      const csvRow = csvMap.get(data.setId);
      if (!csvRow) {
        console.log(`Skipping ${fileName}: set ${data.setId} not found in CSV`);
        skipped++;
        return;
      }

      let modified = false;

      // Remove isRetired if it exists
      if ('isRetired' in data) {
        delete data.isRetired;
        modified = true;
      }

      // Parse ExitDate from "DD/MM/YYYY HH:mm:ss" to extract just the year
      const exitDateStr = csvRow.ExitDate;
      let yearRetired = null;
      if (exitDateStr && exitDateStr.trim()) {
        const parts = exitDateStr.trim().split(' ')[0].split('/');
        if (parts.length === 3) {
          yearRetired = parseInt(parts[2], 10);
        }
      }

      // Only add yearRetired if it exists (set has been retired)
      if (yearRetired) {
        data.yearRetired = yearRetired;
        modified = true;
      } else if ('yearRetired' in data) {
        // Remove yearRetired if it exists but ExitDate is empty
        delete data.yearRetired;
        modified = true;
      }

      if (modified) {
        // Write back with proper formatting
        const yamlStr = yaml.dump(data, { indent: 2, lineWidth: -1 });
        fs.writeFileSync(filePath, yamlStr);
        console.log(`Migrated ${fileName} (set ${data.setId})${yearRetired ? ` -> yearRetired: ${yearRetired}` : ' (no retirement date)'}`);
        migrated++;
      } else {
        skipped++;
      }
    });

    console.log(`\nMigration complete: ${migrated} files migrated, ${skipped} files skipped`);
  });
