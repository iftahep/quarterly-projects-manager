const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log
});

async function addBaselineColumn() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Check if column exists by trying to query it
    try {
      await sequelize.query('SELECT baseline_data FROM quarters LIMIT 1');
      console.log('baseline_data column already exists.');
    } catch (error) {
      // Column doesn't exist, add it
      console.log('Adding baseline_data column...');
      await sequelize.query(`
        ALTER TABLE quarters 
        ADD COLUMN baseline_data TEXT
      `);
      console.log('baseline_data column added successfully.');
    }

    await sequelize.close();
    console.log('Database update complete.');
  } catch (error) {
    console.error('Error updating database:', error);
    process.exit(1);
  }
}

addBaselineColumn();
