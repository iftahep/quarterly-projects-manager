const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Path to the database file
const dbPath = path.join(__dirname, 'server', 'database.sqlite');

// Check if database file exists
if (!fs.existsSync(dbPath)) {
  console.log('Database file not found at:', dbPath);
  console.log('The database will be created automatically when the server starts.');
  process.exit(0);
}

// Connect to the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

// Add the baseline_data column
const sql = `ALTER TABLE quarters ADD COLUMN baseline_data TEXT;`;

db.run(sql, (err) => {
  if (err) {
    // Check if error is because column already exists
    if (err.message.includes('duplicate column name') || err.message.includes('already exists')) {
      console.log('Column "baseline_data" already exists. No changes needed.');
    } else {
      console.error('Error adding column:', err.message);
      process.exit(1);
    }
  } else {
    console.log('Column "baseline_data" added successfully!');
  }
  
  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
      process.exit(1);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

