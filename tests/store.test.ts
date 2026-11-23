import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MemoryStore } from "../lib/store";

describe("MemoryStore", () => {
  it("creates, lists and removes", async () => {
    const s = new MemoryStore();
    const a = await s.create("items", { name: "a" });
    await s.create("items", { name: "b" });
    expect((await s.list("items")).length).toBe(2);
    expect(await s.remove("items", a.id)).toBe(true);
    expect((await s.list("items")).map((d) => d.name)).toEqual(["b"]);
  });

  it("updates", async () => {
    const s = new MemoryStore();
    const a = await s.create("items", { name: "a" });
    expect((await s.update("items", a.id, { name: "z" }))?.name).toBe("z");
  });
});

describe("layout", () => {
  it("loads the POC banner", () => {
    expect(readFileSync("app/layout.tsx", "utf8")).toContain("<SfBanner />");
    expect(readFileSync("app/sf-banner.tsx", "utf8")).toContain('id="sf-banner"');
  });
});
