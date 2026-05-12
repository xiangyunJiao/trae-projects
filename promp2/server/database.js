const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
const dbPath = path.join(__dirname, '..', 'data', 'monitoring.db');

async function initDB() {
  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS performance_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      app_version TEXT,
      device TEXT,
      device_type TEXT,
      os TEXT,
      os_version TEXT,
      browser TEXT,
      browser_version TEXT,
      network_type TEXT,
      white_screen_time INTEGER,
      first_screen_time INTEGER,
      dom_ready_time INTEGER,
      load_event_time INTEGER,
      redirect_count INTEGER,
      redirect_time INTEGER,
      dns_time INTEGER,
      tcp_time INTEGER,
      ttfb INTEGER,
      transfer_time INTEGER,
      parse_dom_time INTEGER,
      resource_count INTEGER,
      page_url TEXT,
      timestamp INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS error_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      app_version TEXT,
      device TEXT,
      device_type TEXT,
      os TEXT,
      os_version TEXT,
      browser TEXT,
      browser_version TEXT,
      network_type TEXT,
      error_type TEXT,
      error_message TEXT,
      error_stack TEXT,
      error_file TEXT,
      error_line INTEGER,
      error_column INTEGER,
      page_url TEXT,
      timestamp INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS exception_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      app_version TEXT,
      device TEXT,
      device_type TEXT,
      os TEXT,
      os_version TEXT,
      browser TEXT,
      browser_version TEXT,
      network_type TEXT,
      exception_type TEXT,
      exception_message TEXT,
      exception_stack TEXT,
      page_url TEXT,
      timestamp INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS page_view_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      app_version TEXT,
      device TEXT,
      device_type TEXT,
      os TEXT,
      os_version TEXT,
      browser TEXT,
      browser_version TEXT,
      network_type TEXT,
      page_url TEXT,
      entry_url TEXT,
      exit_url TEXT,
      stay_time INTEGER,
      scroll_depth REAL,
      click_count INTEGER,
      timestamp INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS resource_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      app_version TEXT,
      device TEXT,
      device_type TEXT,
      os TEXT,
      os_version TEXT,
      browser TEXT,
      browser_version TEXT,
      network_type TEXT,
      resource_url TEXT,
      resource_type TEXT,
      resource_duration INTEGER,
      resource_size INTEGER,
      success INTEGER,
      page_url TEXT,
      timestamp INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS api_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      app_version TEXT,
      device TEXT,
      device_type TEXT,
      os TEXT,
      os_version TEXT,
      browser TEXT,
      browser_version TEXT,
      network_type TEXT,
      api_url TEXT,
      api_method TEXT,
      api_status INTEGER,
      api_duration INTEGER,
      success INTEGER,
      error_message TEXT,
      page_url TEXT,
      timestamp INTEGER
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_perf_user ON performance_data(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_perf_time ON performance_data(timestamp)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_perf_version ON performance_data(app_version)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_error_user ON error_data(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_error_time ON error_data(timestamp)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_error_version ON error_data(app_version)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_exception_user ON exception_data(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_exception_time ON exception_data(timestamp)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_exception_version ON exception_data(app_version)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_pv_user ON page_view_data(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_pv_time ON page_view_data(timestamp)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_pv_version ON page_view_data(app_version)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_api_user ON api_data(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_api_time ON api_data(timestamp)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_api_version ON api_data(app_version)`);

  saveDatabase();
  return db;
}

function saveDatabase() {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results[0] || null;
}

function execute(sql, params = []) {
  db.run(sql, params);
  saveDatabase();
  return { changes: db.getRowsModified() };
}

function prepare(sql) {
  const stmt = db.prepare(sql);
  
  return {
    run(...params) {
      stmt.bind(params);
      stmt.step();
      stmt.reset();
      saveDatabase();
      return { lastInsertRowid: null, changes: db.getRowsModified() };
    },
    get(...params) {
      stmt.bind(params);
      const result = stmt.step() ? stmt.getAsObject() : null;
      stmt.reset();
      return result;
    },
    all(...params) {
      if (params.length > 0) stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.reset();
      return results;
    }
  };
}

module.exports = {
  initDB,
  queryAll,
  queryOne,
  execute,
  prepare,
  saveDatabase
};
