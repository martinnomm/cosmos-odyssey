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

      // TODO: Finish reservation
      // db.run(
      //   `CREATE TABLE IF NOT EXISTS reservation (
      //     id INTEGER PRIMARY KEY AUTOINCREMENT,
      //     routelist_id TEXT,
      //     first_name TEXT,
      //     last_name TEXT,
      //     routes_id TEXT,
      //     total_price REAL,
      //     total_travel_time REAL,
      //     companies_id TEXT,
      //     FOREIGN KEY (routelist_id) REFERENCES routelist(id) ON DELETE CASCADE
      //   )`
      // )
      // var insert = 'INSERT INTO routelist (id, valid_until) VALUES (?,?)'
      // db.run(insert, ["timedate","time('now')"])
      // db.run(insert, ["old","2022-10-04T19:21:31.3425522Z"])
      // db.run("DELETE FROM routelist WHERE id = '872f29e7-5ffc-4d56-9cf7-c45176bb045e'")
  }
});


module.exports = db