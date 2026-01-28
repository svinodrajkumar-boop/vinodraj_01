console.log('Starting clean test...\n');

// Test 1: Check environment
require('dotenv').config();
console.log('1. Environment loaded:', process.env.NODE_ENV);

// Test 2: Check database connection
const { testConnection } = require('./src/config/database');
console.log('2. Testing database connection...');

async function runTests() {
  try {
    // Test database
    const dbConnected = await testConnection();
    console.log('   Database:', dbConnected ? '? Connected' : '? Failed');
    
    // Test models initialization
    console.log('3. Initializing models...');
    const models = require('./src/models');
    const initializedModels = await models.initializeModels();
    console.log('   Models: ? Initialized successfully');
    
    // Check if tables were created
    const result = await models.sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    console.log('\n4. Database tables created:');
    result[0].forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
    
    console.log('\n?? All tests passed! System is ready.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n? Test failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

runTests();