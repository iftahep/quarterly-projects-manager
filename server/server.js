const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false // Set to console.log if you want to see SQL queries
});

// Define Quarter Model
const Quarter = sequelize.define('Quarter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'quarters',
  timestamps: true // Adds createdAt and updatedAt
});

// Initialize database and create tables
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync({ force: false }); // Set to true to drop and recreate tables
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// API Routes

// GET /api/quarters - Returns list of all quarters
app.get('/api/quarters', async (req, res) => {
  try {
    const quarters = await Quarter.findAll({
      attributes: ['id', 'name', 'isActive', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(quarters);
  } catch (error) {
    console.error('Error fetching quarters:', error);
    res.status(500).json({ error: 'Failed to fetch quarters' });
  }
});

// POST /api/quarters - Creates a new quarter
app.post('/api/quarters', async (req, res) => {
  try {
    const { name, data } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Quarter name is required' });
    }
    
    if (!data) {
      return res.status(400).json({ error: 'Quarter data is required' });
    }
    
    const quarter = await Quarter.create({
      name,
      data,
      isActive: false
    });
    
    res.status(201).json({
      id: quarter.id,
      name: quarter.name,
      isActive: quarter.isActive,
      createdAt: quarter.createdAt,
      updatedAt: quarter.updatedAt
    });
  } catch (error) {
    console.error('Error creating quarter:', error);
    res.status(500).json({ error: 'Failed to create quarter' });
  }
});

// GET /api/quarters/:id - Returns full data for a specific quarter
app.get('/api/quarters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quarter = await Quarter.findByPk(id);
    
    if (!quarter) {
      return res.status(404).json({ error: 'Quarter not found' });
    }
    
    res.json(quarter);
  } catch (error) {
    console.error('Error fetching quarter:', error);
    res.status(500).json({ error: 'Failed to fetch quarter' });
  }
});

// PUT /api/quarters/:id - Updates quarter data and optionally name
app.put('/api/quarters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, data } = req.body;
    
    const quarter = await Quarter.findByPk(id);
    
    if (!quarter) {
      return res.status(404).json({ error: 'Quarter not found' });
    }
    
    const updateFields = {};
    if (name !== undefined) {
      updateFields.name = name;
    }
    if (data !== undefined) {
      updateFields.data = data;
    }
    
    await quarter.update(updateFields);
    
    res.json({
      id: quarter.id,
      name: quarter.name,
      isActive: quarter.isActive,
      data: quarter.data,
      updatedAt: quarter.updatedAt
    });
  } catch (error) {
    console.error('Error updating quarter:', error);
    res.status(500).json({ error: 'Failed to update quarter' });
  }
});

// POST /api/quarters/:id/activate - Sets this quarter as active
app.post('/api/quarters/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;
    
    const quarter = await Quarter.findByPk(id);
    
    if (!quarter) {
      return res.status(404).json({ error: 'Quarter not found' });
    }
    
    // Set all quarters to inactive
    await Quarter.update(
      { isActive: false },
      { where: {} }
    );
    
    // Set this quarter as active
    await quarter.update({ isActive: true });
    
    res.json({
      id: quarter.id,
      name: quarter.name,
      isActive: quarter.isActive,
      message: 'Quarter activated successfully'
    });
  } catch (error) {
    console.error('Error activating quarter:', error);
    res.status(500).json({ error: 'Failed to activate quarter' });
  }
});

// GET /api/quarters/active - Get the currently active quarter
app.get('/api/quarters/active', async (req, res) => {
  try {
    const activeQuarter = await Quarter.findOne({
      where: { isActive: true }
    });
    
    if (!activeQuarter) {
      return res.status(404).json({ error: 'No active quarter found' });
    }
    
    res.json(activeQuarter);
  } catch (error) {
    console.error('Error fetching active quarter:', error);
    res.status(500).json({ error: 'Failed to fetch active quarter' });
  }
});

// DELETE /api/quarters/:id - Delete a quarter
app.delete('/api/quarters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const quarter = await Quarter.findByPk(id);
    
    if (!quarter) {
      return res.status(404).json({ error: 'Quarter not found' });
    }
    
    await quarter.destroy();
    
    res.json({ message: 'Quarter deleted successfully', id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting quarter:', error);
    res.status(500).json({ error: 'Failed to delete quarter' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

