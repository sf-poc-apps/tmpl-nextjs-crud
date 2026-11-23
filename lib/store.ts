// Tiny document store. Firestore when FIRESTORE_DB is set, in-memory otherwise (tests, local runs).
import { randomUUID } from "node:crypto";

export type Doc = Record<string, unknown> & { id: string; created_at: string; updated_at: string };

export interface Store {
  list(collection: string, orderBy?: string): Promise<Doc[]>;
  get(collection: string, id: string): Promise<Doc | null>;
  create(collection: string, data: Record<string, unknown>): Promise<Doc>;
  update(collection: string, id: string, data: Record<string, unknown>): Promise<Doc | null>;
  remove(collection: string, id: string): Promise<boolean>;
}

const now = () => new Date().toISOString();
const sortBy = (rows: Doc[], orderBy?: string) => {
  if (!orderBy) return rows;
  const desc = orderBy.startsWith("-");
  const key = orderBy.replace(/^-/, "");
  return [...rows].sort((a, b) => String(a[key] ?? "").localeCompare(String(b[key] ?? "")) * (desc ? -1 : 1));
};

export class MemoryStore implements Store {
  private data = new Map<string, Map<string, Doc>>();
  private col(name: string) {
    if (!this.data.has(name)) this.data.set(name, new Map());
    return this.data.get(name)!;
  }
  async list(collection: string, orderBy?: string) {
    return sortBy([...this.col(collection).values()].map((d) => ({ ...d })), orderBy);
  }
  async get(collection: string, id: string) {
    const d = this.col(collection).get(id);
    return d ? { ...d } : null;
  }
  async create(collection: string, data: Record<string, unknown>) {
    const doc: Doc = { ...data, id: randomUUID().slice(0, 12), created_at: now(), updated_at: now() };
    this.col(collection).set(doc.id, doc);
    return { ...doc };
  }
  async update(collection: string, id: string, data: Record<string, unknown>) {
    const cur = this.col(collection).get(id);
    if (!cur) return null;
    Object.assign(cur, data, { updated_at: now() });
    return { ...cur };
  }
  async remove(collection: string, id: string) {
    return this.col(collection).delete(id);
  }
}

export class FirestoreStore implements Store {
  private db: import("@google-cloud/firestore").Firestore;
  constructor(databaseId: string) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Firestore } = require("@google-cloud/firestore");
    this.db = new Firestore({ databaseId });
  }
  async list(collection: string, orderBy?: string) {
    const snap = await this.db.collection(collection).limit(500).get();
    return sortBy(snap.docs.map((d) => ({ ...(d.data() as Doc), id: d.id })), orderBy);
  }
  async get(collection: string, id: string) {
    const s = await this.db.collection(collection).doc(id).get();
    return s.exists ? ({ ...(s.data() as Doc), id: s.id } as Doc) : null;
  }
  async create(collection: string, data: Record<string, unknown>) {
    const ref = this.db.collection(collection).doc(randomUUID().slice(0, 12));
    const doc = { ...data, created_at: now(), updated_at: now() };
    await ref.set(doc);
    return { ...doc, id: ref.id } as Doc;
  }
  async update(collection: string, id: string, data: Record<string, unknown>) {
    const ref = this.db.collection(collection).doc(id);
    if (!(await ref.get()).exists) return null;
    await ref.update({ ...data, updated_at: now() });
    return this.get(collection, id);
  }
  async remove(collection: string, id: string) {
    const ref = this.db.collection(collection).doc(id);
    const existed = (await ref.get()).exists;
    await ref.delete();
    return existed;
  }
}

const g = globalThis as unknown as { __store?: Store };
export function getStore(): Store {
  if (!g.__store) {
    g.__store = process.env.FIRESTORE_DB ? new FirestoreStore(process.env.FIRESTORE_DB) : new MemoryStore();
  }
  return g.__store;
}
