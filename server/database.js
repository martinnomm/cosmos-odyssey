const sqlite3  = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  }else{
      console.log('Connected to the SQLite database.')
      db.run(
        `CREATE TABLE IF NOT EXISTS routelist (
          asd INTEGER PRIMARY KEY AUTOINCREMENT,
          id TEXT,
          valid_until TEXT
        )`
      )

      db.run(
        `CREATE TABLE IF NOT EXISTS leg (
          id TEXT PRIMARY KEY,
          routelist_id TEXT,
          distance INTEGER,
          from_planet TEXT,
          to_planet TEXT,
          FOREIGN KEY (routelist_id) REFERENCES routelist(id) ON DELETE CASCADE
        )`
      )

      db.run(
        `CREATE TABLE IF NOT EXISTS provider (
          id TEXT PRIMARY KEY,
          leg_id TEXT,
          price REAL,
          flight_start TEXT,
          flight_end TEXT,
          company TEXT,
          FOREIGN KEY (leg_id) REFERENCES leg(id) ON DELETE CASCADE
        )`
      )

      db.run(
        `CREATE TABLE IF NOT EXISTS reservation (
          id TEXT PRIMARY KEY,
          routelist_id TEXT,
          first_name TEXT,
          last_name TEXT,
          total_price REAL,
          total_travel_time REAL,
          FOREIGN KEY (routelist_id) REFERENCES routelist(id) ON DELETE CASCADE
        )`
      )

      db.run(
        `CREATE TABLE IF NOT EXISTS reservation_provider(
          id TEXT PRIMARY KEY,
          reservation_id TEXT,
          provider_id TEXT,
          FOREIGN KEY (reservation_id) REFERENCES reservation(id) ON DELETE CASCADE
        )`
      )
  }
});


module.exports = db