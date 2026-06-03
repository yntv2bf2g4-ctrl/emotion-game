console.log("SERVER FILE UPDATED");

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path    = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/parts", express.static(path.join(__dirname, "parts")));

const db = new sqlite3.Database("./database.db");

// Crée la table avec tous les nouveaux champs
db.run(`
CREATE TABLE IF NOT EXISTS characters (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT,
  title       TEXT,
  story       TEXT,
  symbol      TEXT,
  eyebrow     TEXT,
  eyes        TEXT,
  nose        TEXT,
  mouth       TEXT,
  hairstyle   TEXT,
  gesture     TEXT,
  body_top    TEXT,
  face        TEXT,
  body_bottom TEXT,
  joy         INTEGER,
  sadness     INTEGER,
  anger       INTEGER,
  fear        INTEGER,
  surprise    INTEGER,
  color       TEXT
)
`);

// Ajoute les colonnes manquantes si la table existait déjà (migration douce)
const newCols = [
  "symbol TEXT", "eyebrow TEXT", "hairstyle TEXT",
  "gesture TEXT", "body_top TEXT", "face TEXT", "body_bottom TEXT",
  "title TEXT", "color TEXT"
];
newCols.forEach(col => {
  const name = col.split(" ")[0];
  db.run(`ALTER TABLE characters ADD COLUMN ${col}`, () => {
    // silently ignore "duplicate column" errors
  });
});

// ── POST /save-character ──────────────────────────────────────
app.post("/save-character", (req, res) => {
  const {
    name, title, story,
    symbol, eyebrow, eyes, nose, mouth,
    hairstyle, gesture, body_top, face, body_bottom,
    joy, sadness, anger, fear, surprise, color
  } = req.body;

  db.run(
    `INSERT INTO characters
     (name, title, story, symbol, eyebrow, eyes, nose, mouth,
      hairstyle, gesture, body_top, face, body_bottom,
      joy, sadness, anger, fear, surprise, color)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      name, title, story,
      symbol, eyebrow, eyes, nose, mouth,
      hairstyle, gesture, body_top, face, body_bottom,
      joy, sadness, anger, fear, surprise, color
    ],
    function(err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, insertedId: this.lastID });
    }
  );
});

// ── GET /get-character/:id ────────────────────────────────────
app.get("/get-character/:id", (req, res) => {
  db.get(
    "SELECT * FROM characters WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});

// ── GET /all-characters ───────────────────────────────────────
app.get("/all-characters", (req, res) => {
  db.all(
    "SELECT * FROM characters ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) { console.log(err); return res.status(500).json({ error: true }); }
      res.json(rows);
    }
  );
});

app.get("/test",  (req, res) => res.send("TEST OK"));
app.get("/debug", (req, res) => res.send(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

app.get("/latest-character", (req, res) => {
  db.get(
    "SELECT * FROM characters ORDER BY id DESC LIMIT 1",
    [],
    (err, row) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    }
  );
});