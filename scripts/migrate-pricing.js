const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const legoDir = path.join(__dirname, '..', 'content', 'items', 'lego');
const files = fs.readdirSync(legoDir).filter(f => f.endsWith('.yaml'));

console.log(`Found ${files.length} YAML files to migrate...\n`);

let migrated = 0;
let skipped = 0;
let errors = 0;

files.forEach(file => {
  const filePath = path.join(legoDir, file);

  try {
    // Read existing YAML
    const content = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(content);

    // Check if retailPrice exists
    if (data.retailPrice !== undefined) {
      // Rename to referenceRetailPrice
      data.referenceRetailPrice = data.retailPrice;
      delete data.retailPrice;

      // Add genuinePrice with same value
      data.genuinePrice = data.referenceRetailPrice;

      // Write back with consistent formatting
      const newYaml = yaml.dump(data, {
        indent: 2,
        lineWidth: -1,  // Don't wrap lines
        noRefs: true    // Don't use anchors
      });

      fs.writeFileSync(filePath, newYaml, 'utf8');
      migrated++;
      console.log(`✓ Migrated: ${file}`);
    } else {
      skipped++;
      console.log(`⊘ No retailPrice found: ${file}`);
    }
  } catch (error) {
    errors++;
    console.error(`✗ Error migrating ${file}:`, error.message);
  }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`Migration complete:`);
console.log(`  ✓ Migrated: ${migrated} files`);
console.log(`  ⊘ Skipped:  ${skipped} files`);
console.log(`  ✗ Errors:   ${errors} files`);
console.log(`${'='.repeat(50)}`);

if (errors > 0) {
  process.exit(1);
}
