import { createClient } from "@libsql/client";
import { existsSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
export class KnowledgeDB {
    db;
    initialized = false;
    constructor(dbPath) {
        const absPath = resolve(dbPath);
        const dir = dirname(absPath);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
        this.db = createClient({
            url: `file:${absPath}`,
        });
    }
    async init() {
        if (this.initialized)
            return;
        await this.db.execute(`
      CREATE TABLE IF NOT EXISTS memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fact TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'fact',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
        await this.db.execute("CREATE INDEX IF NOT EXISTS idx_memory_type ON memory(type)");
        await this.db.execute("CREATE INDEX IF NOT EXISTS idx_memory_created ON memory(created_at DESC)");
        try {
            await this.db.execute("CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(fact, content=memory, content_rowid=id)");
        }
        catch {
            await this.db.execute("CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(fact, content_rowid=id)");
        }
        try {
            await this.db.execute(`
        CREATE TRIGGER IF NOT EXISTS memory_ai AFTER INSERT ON memory BEGIN
          INSERT INTO memory_fts(rowid, fact) VALUES (new.id, new.fact);
        END
      `);
        }
        catch {
            /* trigger may already exist */
        }
        try {
            await this.db.execute(`
        CREATE TRIGGER IF NOT EXISTS memory_ad AFTER DELETE ON memory BEGIN
          INSERT INTO memory_fts(memory_fts, rowid, fact) VALUES('delete', old.id, old.fact);
        END
      `);
        }
        catch {
            /* trigger may already exist */
        }
        this.initialized = true;
    }
    async remember(fact, type) {
        await this.init();
        const result = await this.db.execute({
            sql: "INSERT INTO memory (fact, type) VALUES (?, ?)",
            args: [fact, type],
        });
        return {
            id: Number(result.lastInsertRowid),
            fact,
            type,
            created_at: new Date().toISOString(),
        };
    }
    async recall(query, limit) {
        await this.init();
        if (!query.trim()) {
            const rows = await this.db.execute({
                sql: "SELECT id, fact, type, created_at FROM memory ORDER BY created_at DESC LIMIT ?",
                args: [limit],
            });
            return rows.rows.map((r, i) => ({
                id: Number(r.id),
                fact: String(r.fact),
                type: String(r.type),
                created_at: String(r.created_at),
                rank: i + 1,
            }));
        }
        const sanitized = query
            .replace(/[^\w\s가-힣]/g, " ")
            .split(/\s+/)
            .filter(Boolean)
            .map((w) => `"${w}"`)
            .join(" OR ");
        try {
            const rows = await this.db.execute({
                sql: `
          SELECT m.id, m.fact, m.type, m.created_at, fts.rank
          FROM memory m
          JOIN memory_fts fts ON m.id = fts.rowid
          WHERE memory_fts MATCH ?
          ORDER BY fts.rank
          LIMIT ?
        `,
                args: [sanitized, limit],
            });
            return rows.rows.map((r) => ({
                id: Number(r.id),
                fact: String(r.fact),
                type: String(r.type),
                created_at: String(r.created_at),
                rank: Number(r.rank),
            }));
        }
        catch {
            return [];
        }
    }
    async forget(id) {
        await this.init();
        const result = await this.db.execute({
            sql: "DELETE FROM memory WHERE id = ?",
            args: [id],
        });
        return Number(result.rowsAffected) > 0;
    }
    async update(id, fact, type) {
        await this.init();
        const tx = await this.db.transaction();
        try {
            const existing = await tx.execute({
                sql: "SELECT id, fact, type, created_at FROM memory WHERE id = ?",
                args: [id],
            });
            if (existing.rows.length === 0) {
                await tx.rollback();
                return null;
            }
            const oldFact = String(existing.rows[0].fact);
            const oldType = String(existing.rows[0].type);
            await tx.execute({
                sql: "DELETE FROM memory WHERE id = ?",
                args: [id],
            });
            const result = await tx.execute({
                sql: "INSERT INTO memory (fact, type) VALUES (?, ?)",
                args: [fact || oldFact, type || oldType],
            });
            await tx.commit();
            return {
                id: Number(result.lastInsertRowid),
                fact: fact || oldFact,
                type: type || oldType,
                created_at: new Date().toISOString(),
            };
        }
        catch (err) {
            await tx.rollback();
            throw err;
        }
    }
    async stats() {
        await this.init();
        const totalRow = await this.db.execute("SELECT COUNT(*) as c FROM memory");
        const total = Number(totalRow.rows[0].c);
        const typeRows = await this.db.execute("SELECT type, COUNT(*) as c FROM memory GROUP BY type");
        const byType = {};
        for (const r of typeRows.rows) {
            byType[String(r.type)] = Number(r.c);
        }
        const pageRow = await this.db.execute("PRAGMA page_count");
        const sizeRow = await this.db.execute("PRAGMA page_size");
        const pageCount = Number(pageRow.rows[0].page_count);
        const pageSize = Number(sizeRow.rows[0].page_size);
        return { total, byType, dbSize: pageCount * pageSize };
    }
    close() {
        this.db.close();
    }
}
