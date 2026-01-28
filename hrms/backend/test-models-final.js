const { initializeModels, sequelize } = require('./src/models');

async function test() {
  try {
    console.log('Testing model connection to database tables...');
    
    // Initialize models
    const models = await initializeModels();
    console.log('? Models initialized successfully');
    
    // Test if we can query the tables using sequelize directly
    const [companyCount] = await sequelize.query('SELECT COUNT(*) FROM company');
    console.log('? Can query company table:', companyCount[0].count);
    
    const [departmentCount] = await sequelize.query('SELECT COUNT(*) FROM department');
    console.log('? Can query department table:', departmentCount[0].count);
    
    const [designationCount] = await sequelize.query('SELECT COUNT(*) FROM designation');
    console.log('? Can query designation table:', designationCount[0].count);
    
    const [employeeCount] = await sequelize.query('SELECT COUNT(*) FROM employee');
    console.log('? Can query employee table:', employeeCount[0].count);
    
    const [usersCount] = await sequelize.query('SELECT COUNT(*) FROM users');
    console.log('? Can query users table:', usersCount[0].count);
    
    console.log('\n?? All tables are accessible! Database setup complete.');
    process.exit(0);
    
  } catch (error) {
    console.error('? Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

test();
