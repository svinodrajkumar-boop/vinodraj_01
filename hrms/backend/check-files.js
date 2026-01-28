const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/app.js',
  'src/server.js',
  'src/config/database.js',
  'src/config/environment.js',
  'src/config/constants.js',
  'src/utils/logger.js',
  'src/models/index.js',
  'src/models/Company.js',
  'src/models/Department.js',
  'src/models/Designation.js',
  'src/models/Employee.js',
  'src/models/User.js',
  'src/controllers/departmentController.js',
  'src/middleware/auth.js',
  'src/middleware/errorHandler.js',
  'src/middleware/validation.js',
  '.env',
  'package.json'
];

console.log('Checking required files...\n');

let missingFiles = [];
let existingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    existingFiles.push(file);
    console.log(`? ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`? ${file} - MISSING`);
  }
});

console.log(`\n?? Summary:`);
console.log(`? Found: ${existingFiles.length} files`);
console.log(`? Missing: ${missingFiles.length} files`);

if (missingFiles.length > 0) {
  console.log('\nMissing files:');
  missingFiles.forEach(file => console.log(`  - ${file}`));
  process.exit(1);
} else {
  console.log('\n?? All required files are present!');
  process.exit(0);
}
