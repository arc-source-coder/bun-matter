import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe("gray-matter", () => {
  it("should extract YAML front matter", () => {
    const actual = matter("---\nabc: xyz\n---");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.data.abc).toEqual("xyz");
  });

  it("extra characters should throw parsing errors", () => {
    expect(() => matter("---whatever\nabc: xyz\n---")).toThrow();
  });

  it("boolean yaml types should still return the empty object", () => {
    const actual = matter("--- true\n---");
    expect(actual.data).toEqual({});
  });

  it("string yaml types should still return the empty object", () => {
    const actual = matter("--- true\n---");
    expect(actual.data).toEqual({});
  });

  it("number yaml types should still return the empty object", () => {
    const actual = matter("--- 42\n---");
    expect(actual.data).toEqual({});
  });

  it("should throw an error when a string is not passed:", () => {
    expect(() => matter()).toThrow();
  });

  it("should return an object when the string is 0 length:", () => {
    expect(typeof matter("") === "object").toBeTruthy();
  });

  it("should extract YAML front matter and content", () => {
    const fixture =
      '---\nabc: xyz\nversion: 2\n---\n\n<span class="alert alert-info">This is an alert</span>\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ abc: "xyz", version: 2 });
    expect(actual.content).toBe('\n<span class="alert alert-info">This is an alert</span>\n');
  });

  it("should use custom delimiters as an array.", () => {
    const fixture =
      '~~~\nabc: xyz\nversion: 2\n~~~\n\n<span class="alert alert-info">This is an alert</span>\n';
    const actual = matter(fixture, { delimiters: ["~~~", "~~~"] });
    expect(actual.data).toEqual({ abc: "xyz", version: 2 });
    expect(actual.content).toBe('\n<span class="alert alert-info">This is an alert</span>\n');
  });

  it("should use custom opening and closing delimiters.", () => {
    const fixture =
      '~~~\nabc: xyz\nversion: 2\n---\n\n<span class="alert alert-info">This is an alert</span>\n';
    const actual = matter(fixture, { delimiters: ["~~~", "---"] });
    expect(actual.data).toEqual({ abc: "xyz", version: 2 });
    expect(actual.content).toBe('\n<span class="alert alert-info">This is an alert</span>\n');
  });

  it("should correctly identify delimiters and ignore strings that look like delimiters.", () => {
    const fixture = '---\nname: "troublesome --- value"\n---\nhere is some content\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ name: "troublesome --- value" });
    expect(actual.content).toBe("here is some content\n");
  });

  it("should correctly parse a string that only has an opening delimiter", () => {
    const fixture = '---\nname: "troublesome --- value"\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ name: "troublesome --- value" });
    expect(actual.content).toBe("");
  });

  it("should not try to parse a string has content that looks like front-matter.", () => {
    const fixture = "-----------name--------------value\nfoo";
    const actual = matter(fixture);
    expect(actual.data).toEqual({});
    expect(actual.content).toBe("-----------name--------------value\nfoo");
  });
});
