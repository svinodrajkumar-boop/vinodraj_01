const { initializeModels } = require('./src/models');

async function test() {
  try {
    console.log('Testing model connection to database tables...');
    
    // Initialize models
    const models = await initializeModels();
    console.log('? Models initialized successfully');
    
    // Test if we can query the tables
    const companyCount = await models.sequelize.query('SELECT COUNT(*) FROM company');
    console.log('? Can query company table');
    
    const departmentCount = await models.sequelize.query('SELECT COUNT(*) FROM department');
    console.log('? Can query department table');
    
    const designationCount = await models.sequelize.query('SELECT COUNT(*) FROM designation');
    console.log('? Can query designation table');
    
    const employeeCount = await models.sequelize.query('SELECT COUNT(*) FROM employee');
    console.log('? Can query employee table');
    
    const usersCount = await models.sequelize.query('SELECT COUNT(*) FROM users');
    console.log('? Can query users table');
    
    console.log('\n?? All tables are accessible! Database setup complete.');
    process.exit(0);
    
  } catch (error) {
    console.error('? Error:', error.message);
    process.exit(1);
  }
}

test();
