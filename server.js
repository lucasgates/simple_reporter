import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, 'reports.db');

// Check if database file exists
const dbExists = fs.existsSync(DB_PATH);

// Initialize database
const dbPromise = open({
  filename: DB_PATH,
  driver: sqlite3.Database
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Initialize database tables
async function initDb() {
  const db = await dbPromise;
  
  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Log database status
  if (!dbExists) {
    console.log('New database created and initialized');
  } else {
    console.log('Existing database connected');
  }
  
  // Log table info
  const tableInfo = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Available tables:', tableInfo.map(t => t.name).join(', '));
  
  // Count existing reports
  const reportCount = await db.get('SELECT COUNT(*) as count FROM reports');
  console.log(`Database contains ${reportCount.count} reports`);
}

// Routes
app.post('/api/reports', async (req, res) => {
  try {
    const reportData = req.body;
    const reportId = uuidv4();
    
    const db = await dbPromise;
    await db.run(
      'INSERT INTO reports (id, data) VALUES (?, ?)',
      [reportId, JSON.stringify(reportData)]
    );
    
    const reportUrl = `${req.protocol}://${req.get('host')}/report/${reportId}`;
    
    res.status(201).json({
      success: true,
      reportId,
      reportUrl
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create report'
    });
  }
});

app.get('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = await dbPromise;
    const report = await db.get('SELECT * FROM reports WHERE id = ?', [id]);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }
    
    res.json({
      success: true,
      report: {
        id: report.id,
        data: JSON.parse(report.data),
        createdAt: report.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report'
    });
  }
});

// Add a route to list all reports (for debugging/admin purposes)
app.get('/api/reports', async (req, res) => {
  try {
    const db = await dbPromise;
    const reports = await db.all('SELECT id, created_at FROM reports ORDER BY created_at DESC');
    
    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error listing reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list reports'
    });
  }
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`- API available at http://localhost:${PORT}/api`);
    console.log(`- Frontend available at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});