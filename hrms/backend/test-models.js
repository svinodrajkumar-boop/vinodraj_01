const { initializeModels } = require('./src/models');

async function testModels() {
  try {
    console.log('Testing models initialization...');
    
    // Initialize all models
    const models = await initializeModels();
    console.log('? Models initialized successfully!');
    
    // Test each model
    const modelNames = Object.keys(models).filter(name => name !== 'initializeModels' && name !== 'sequelize');
    
    console.log('\nAvailable models:');
    modelNames.forEach(name => {
      console.log(`  - ${name}`);
    });
    
    console.log(`\n? Total ${modelNames.length} models loaded`);
    
    // Test database connection
    const db = require('./src/config/database');
    await db.testConnection();
    
    process.exit(0);
    
  } catch (error) {
    console.error('? Error initializing models:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testModels();