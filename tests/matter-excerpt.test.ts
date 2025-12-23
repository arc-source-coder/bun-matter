import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe.skip(".excerpt (TODO: Fix excerpt contract)", () => {
  it("should get an excerpt after front matter", () => {
    const file = matter("---\nabc: xyz\n---\nfoo\nbar\nbaz\n---\ncontent", {
      excerpt: true,
    });

    expect(file.matter).toBe("\nabc: xyz");
    expect(file.content).toBe("foo\nbar\nbaz\n---\ncontent");
    expect(file.excerpt).toBe("foo\nbar\nbaz\n");
    expect(file.data.abc).toEqual("xyz");
  });

  it("should not get excerpt when disabled", () => {
    const file = matter("---\nabc: xyz\n---\nfoo\nbar\nbaz\n---\ncontent");

    expect(file.matter).toBe("\nabc: xyz");
    expect(file.content).toBe("foo\nbar\nbaz\n---\ncontent");
    expect(file.excerpt).toBe("");
    expect(file.data.abc).toEqual("xyz");
  });

  it("should use a custom separator", () => {
    const file = matter("---\nabc: xyz\n---\nfoo\nbar\nbaz\n<!-- endexcerpt -->\ncontent", {
      excerpt_separator: "<!-- endexcerpt -->",
    });

    expect(file.matter).toBe("\nabc: xyz");
    expect(file.content).toBe("foo\nbar\nbaz\n<!-- endexcerpt -->\ncontent");
    expect(file.excerpt).toBe("foo\nbar\nbaz\n");
    expect(file.data.abc).toEqual("xyz");
  });

  it("should use a custom separator when no front-matter exists", () => {
    const file = matter("foo\nbar\nbaz\n<!-- endexcerpt -->\ncontent", {
      excerpt_separator: "<!-- endexcerpt -->",
    });

    expect(file.matter).toBe("");
    expect(file.content).toBe("foo\nbar\nbaz\n<!-- endexcerpt -->\ncontent");
    expect(file.excerpt).toBe("foo\nbar\nbaz\n");
    expect(file.data).toEqual({});
  });

  it("should use a custom function to get excerpt", () => {
    const file = matter("---\nabc: xyz\n---\nfoo\nbar\nbaz\n---\ncontent", {
      excerpt: (file) => {
        file.excerpt = "custom";
      },
    });

    expect(file.matter).toBe("\nabc: xyz");
    expect(file.content).toBe("foo\nbar\nbaz\n---\ncontent");
    expect(file.excerpt).toBe("custom");
    expect(file.data.abc).toEqual("xyz");
  });
});
