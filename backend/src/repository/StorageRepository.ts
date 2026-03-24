import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface UsageLog {
  id: string;
  timestamp: string;
  filter_applied: string;
  execution_time_ms: number;
  results_count: number;
}

export class StorageRepository {
  private db: Database.Database;

  constructor(dbPath: string = 'data/usage_logs.db') {
    const resolvedPath = path.resolve(process.cwd(), dbPath);
    const dbDir = path.dirname(resolvedPath);
    
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.db = new Database(resolvedPath);
    this.init();
  }

  private init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS usage_logs (
        id TEXT PRIMARY KEY,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        filter_applied TEXT,
        execution_time_ms INTEGER,
        results_count INTEGER
      )
    `);
  }

  public logUsage(log: UsageLog): void {
    const stmt = this.db.prepare(`
      INSERT INTO usage_logs (id, timestamp, filter_applied, execution_time_ms, results_count)
      VALUES (@id, @timestamp, @filter_applied, @execution_time_ms, @results_count)
    `);
    stmt.run(log);
  }

  public getLogs(): UsageLog[] {
    const stmt = this.db.prepare('SELECT * FROM usage_logs ORDER BY timestamp DESC');
    return stmt.all() as UsageLog[];
  }
}
