const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function runMigration() {
  try {
    console.log('Running database migration...\n');
    
    const migrationFile = path.join(__dirname, 'src/database/migrations/001_initial_schema.sql');
    const sqlContent = fs.readFileSync(migrationFile, 'utf8');
    
    // Split SQL by statements
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    console.log(`Found ${statements.length} SQL statements to execute\n`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt) continue;
      
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        // Use psql to execute the statement
        const { stdout, stderr } = await execPromise(
          `PGPASSWORD='${process.env.DB_PASSWORD}' psql -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -c "${stmt}"`
        );
        
        if (stderr && !stderr.includes('NOTICE')) {
          console.error(`Error: ${stderr}`);
        } else {
          console.log('? Success');
        }
      } catch (error) {
        // Check if it's a "already exists" error (which is OK)
        if (error.stderr && error.stderr.includes('already exists')) {
          console.log('??  Already exists (skipping)');
        } else {
          console.error(`? Failed: ${error.message}`);
          if (error.stderr) console.error(`Details: ${error.stderr}`);
        }
      }
    }
    
    console.log('\n?? Migration completed!');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();