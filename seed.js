const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

// reset table
db.serialize(() => {

  db.run("DROP TABLE IF EXISTS characters");

  db.run(`
    CREATE TABLE characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      story TEXT,
      symbol TEXT,
      eyebrow TEXT,
      eyes TEXT,
      nose TEXT,
      mouth TEXT,
      hairstyle TEXT,
      gesture TEXT,
      body_top TEXT,
      face TEXT,
      body_bottom TEXT,
      joy INTEGER,
      sadness INTEGER,
      anger INTEGER,
      fear INTEGER,
      surprise INTEGER
    )
  `);

  const stmt = db.prepare(`
    INSERT INTO characters
    (name, story, symbol, eyebrow, eyes, nose, mouth, hairstyle, gesture,
     body_top, face, body_bottom, joy, sadness, anger, fear, surprise)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 1; i <= 10; i++) {
    stmt.run(
      "Player" + i,
      "test",
      "parts/symbol/symbol_01.PNG",
      "parts/eyebrows/eyebrow_01.PNG",
      "parts/eyes/eyes_01.PNG",
      "parts/nose/nose_01.PNG",
      "parts/mouth/mouth_01.PNG",
      "parts/hairstyle/hairstyle_01.PNG",
      "parts/gesture/gesture_01.PNG",
      "parts/body_top/body_top_01.PNG",
      "parts/face/face_01.PNG",
      "parts/body_bottom/body_bottom_01.PNG",
      50, 50, 50, 50, 50
    );
  }

  stmt.finalize(() => {
    console.log("✅ DB reset + 10 personnages créés");
    db.close();
  });

});