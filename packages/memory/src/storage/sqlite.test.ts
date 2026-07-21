import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { KnowledgeDB } from "./sqlite.js";
import { unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const TEST_DB = join(tmpdir(), `agent-memory-test-${Date.now()}.db`);

let db: KnowledgeDB;

beforeAll(async () => {
  db = new KnowledgeDB(TEST_DB);
  await db.init();
});

afterAll(() => {
  db.close();
  if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
});

describe("KnowledgeDB", () => {
  it("should remember a fact", async () => {
    const entry = await db.remember("Test fact", "fact");
    expect(entry.fact).toBe("Test fact");
    expect(entry.type).toBe("fact");
    expect(entry.id).toBeTypeOf("number");
  });

  it("should recall by full-text search", async () => {
    await db.remember("pineapple pizza is controversial", "fact");
    const results = await db.recall("pineapple", 5);
    expect(results.some((r: any) => r.fact.includes("pineapple"))).toBe(true);
  });

  it("should recall recent entries with empty query", async () => {
    const results = await db.recall("", 5);
    expect(results.length).toBeGreaterThan(0);
  });

  it("should forget an entry", async () => {
    const entry = await db.remember("to be deleted", "fact");
    const deleted = await db.forget(entry.id);
    expect(deleted).toBe(true);
    const notFound = await db.forget(999999);
    expect(notFound).toBe(false);
  });

  it("should update an entry", async () => {
    const entry = await db.remember("original text", "fact");
    const updated = await db.update(entry.id, "updated text", "decision");
    expect(updated?.fact).toBe("updated text");
    expect(updated?.type).toBe("decision");
  });

  it("should return stats", async () => {
    const stats = await db.stats();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("byType");
    expect(stats).toHaveProperty("dbSize");
    expect(stats.total).toBeGreaterThan(0);
  });
});
