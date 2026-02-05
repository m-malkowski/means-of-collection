/**
 * Migration script to convert storeUrl to links array format
 * Usage: node scripts/migrate-links.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'items', 'lego');

function migrateYamlFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContent);

    if (!data) {
      console.log(`⚠️  Skipping empty file: ${path.basename(filePath)}`);
      return false;
    }

    // Check if storeUrl exists
    if (data.storeUrl) {
      // Create links array from storeUrl
      data.links = [
        {
          url: data.storeUrl,
        },
      ];

      // Remove storeUrl
      delete data.storeUrl;

      // Write back to file
      const newYaml = yaml.dump(data, {
        lineWidth: -1, // Don't line wrap
        noRefs: true, // Don't use anchors
        sortKeys: false, // Preserve key order
        indent: 2,
      });

      fs.writeFileSync(filePath, newYaml, 'utf8');
      console.log(`✅ Migrated: ${path.basename(filePath)} (${data.storeUrl})`);
      return true;
    } else if (data.links) {
      console.log(`ℹ️  Already migrated: ${path.basename(filePath)}`);
      return false;
    } else {
      console.log(`⏭️  No storeUrl or links: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔄 Starting migration from storeUrl to links array...\n');

  const files = fs.readdirSync(CONTENT_DIR)
    .filter(file => file.endsWith('.yaml'))
    .map(file => path.join(CONTENT_DIR, file));

  console.log(`Found ${files.length} YAML files in ${CONTENT_DIR}\n`);

  let migrated = 0;
  let skipped = 0;

  for (const file of files) {
    if (migrateYamlFile(file)) {
      migrated++;
    } else {
      skipped++;
    }
  }

  console.log(`\n✨ Migration complete!`);
  console.log(`   - Migrated: ${migrated} files`);
  console.log(`   - Skipped: ${skipped} files`);
}

main();
