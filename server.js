import sqlite3 from "sqlite3";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Open SQLite database
const db = new sqlite3.Database("./emergensync.db", (err) => {
  if (err) console.error("❌ Database connection error:", err.message);
  else {
    console.log("✅ SQLite DB connected");
    db.run(`
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentName TEXT,
        studentContact TEXT,
        address TEXT,
        birthdate TEXT,
        motherName TEXT,
        motherContact TEXT,
        fatherName TEXT,
        fatherContact TEXT,
        emergencyPerson TEXT,
        emergencyPhone TEXT
      )
    `);
  }
});

// Save emergency contact
app.post("/api/emergency", (req, res) => {
  const {
    studentName, studentContact, address, birthdate,
    motherName, motherContact, fatherName, fatherContact,
    emergencyPerson, emergencyPhone
  } = req.body;

  db.run(
    `INSERT INTO emergency_contacts 
    (studentName, studentContact, address, birthdate, motherName, motherContact, fatherName, fatherContact, emergencyPerson, emergencyPhone) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [studentName, studentContact, address, birthdate, motherName, motherContact, fatherName, fatherContact, emergencyPerson, emergencyPhone],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "❌ Failed to save record" });
      } else {
        res.status(201).json({ message: "✅ Emergency contact saved!", id: this.lastID });
      }
    }
  );
});

// Get all contacts
app.get("/api/emergency", (req, res) => {
  db.all("SELECT * FROM emergency_contacts", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "❌ Failed to fetch records" });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
