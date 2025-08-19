// server.js
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Open SQLite database
let db;
(async () => {
  db = await open({
    filename: "./emergensync.db",
    driver: sqlite3.Database,
  });

  // Create table if not exists
  await db.exec(`
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

  console.log("✅ SQLite DB connected & table ready.");
})();

// Save emergency contact
app.post("/api/emergency", async (req, res) => {
  try {
    const {
      studentName, studentContact, address, birthdate,
      motherName, motherContact, fatherName, fatherContact,
      emergencyPerson, emergencyPhone
    } = req.body;

    await db.run(
      `INSERT INTO emergency_contacts 
      (studentName, studentContact, address, birthdate, motherName, motherContact, fatherName, fatherContact, emergencyPerson, emergencyPhone) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [studentName, studentContact, address, birthdate, motherName, motherContact, fatherName, fatherContact, emergencyPerson, emergencyPhone]
    );

    res.status(201).json({ message: "Emergency contact saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to save record" });
  }
});

// (Optional) Get all contacts
app.get("/api/emergency", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM emergency_contacts");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch records" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
