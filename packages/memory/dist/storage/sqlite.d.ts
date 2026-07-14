export interface MemoryEntry {
    id: number;
    fact: string;
    type: string;
    created_at: string;
}
export interface RecallResult {
    id: number;
    fact: string;
    type: string;
    created_at: string;
    rank: number;
}
export declare class KnowledgeDB {
    private db;
    private initialized;
    constructor(dbPath: string);
    init(): Promise<void>;
    remember(fact: string, type: string): Promise<MemoryEntry>;
    recall(query: string, limit: number): Promise<RecallResult[]>;
    forget(id: number): Promise<boolean>;
    update(id: number, fact: string, type: string): Promise<MemoryEntry | null>;
    stats(): Promise<{
        total: number;
        byType: Record<string, number>;
        dbSize: number;
    }>;
    close(): void;
}
