const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// Use PORT from Render
const PORT = process.env.PORT || 5000;

// Safe database connection
let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  // Test DB connection
  pool.connect()
    .then(client => {
      console.log("Connected to PostgreSQL successfully!");
      client.release();
    })
    .catch(err => {
      console.error("Cannot connect to PostgreSQL:", err);
      console.warn("Database operations will fail until DATABASE_URL is correct.");
    });

  // Create table safely
  async function createTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          name TEXT,
          email TEXT,
          message TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Table ready");
    } catch (err) {
      console.error("Error creating table:", err);
    }
  }

  createTable();
} else {
  console.warn("Warning: DATABASE_URL is not set. Database is disabled.");
}

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running!" });
});

app.post("/submit", async (req, res) => {
  if (!pool) {
    return res.status(500).json({ success: false, error: "Database not configured." });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [name, email, message]
    );
    res.json({ success: true, message: "Message saved successfully", data: result.rows[0] });
  } catch (err) {
    console.error("DB Insert Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});