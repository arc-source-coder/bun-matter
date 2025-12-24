import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe("gray-matter (windows carriage returns)", () => {
  it("should extract YAML front matter", () => {
    const actual = matter("---\r\nabc: xyz\r\n---");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.data.abc).toEqual("xyz");
  });

  it("should throw parsing errors", () => {
    expect(() => matter("---whatever\r\nabc: xyz\r\n---")).toThrow();
  });

  it("should throw an error when a string is not passed:", () => {
    expect(() => matter()).toThrow();
  });

  it("should return an object when the string is 0 length:", () => {
    expect(typeof matter("") === "object").toBeTruthy();
  });

  it("should extract YAML front matter and content", () => {
    const fixture =
      '---\r\nabc: xyz\r\nversion: 2\r\n---\r\n\r\n<span class="alert alert-info">This is an alert</span>\r\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ abc: "xyz", version: 2 });
    expect(actual.content).toBe('\r\n<span class="alert alert-info">This is an alert</span>\r\n');
  });

  it("should use a custom delimiter as a string.", () => {
    const fixture =
      '~~~\r\nabc: xyz\r\nversion: 2\r\n~~~\r\n\r\n<span class="alert alert-info">This is an alert</span>\r\n';
    const actual = matter(fixture, { delimiters: ["~~~", "~~~"] });
    expect(actual.data).toEqual({ abc: "xyz", version: 2 });
    expect(actual.content).toBe('\r\n<span class="alert alert-info">This is an alert</span>\r\n');
  });

  it("should use custom opening and closing delimiters.", () => {
    const fixture =
      '---\r\nabc: xyz\r\nversion: 2\r\n~~~\r\n\r\n<span class="alert alert-info">This is an alert</span>\r\n';
    const actual = matter(fixture, { delimiters: ["---", "~~~"] });
    expect(actual.data).toEqual({ abc: "xyz", version: 2 });
    expect(actual.content).toBe('\r\n<span class="alert alert-info">This is an alert</span>\r\n');
  });

  it("should correctly identify delimiters and ignore strings that look like delimiters.", () => {
    const fixture = '---\r\nname: "troublesome --- value"\r\n---\r\nhere is some content\r\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ name: "troublesome --- value" });
    expect(actual.content).toBe("here is some content\r\n");
  });

  it("should correctly parse a string that only has an opening delimiter", () => {
    const fixture = '---\r\nname: "troublesome --- value"\r\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ name: "troublesome --- value" });
    expect(actual.content).toBe("");
  });

  it("should not try to parse a string has content that looks like front-matter.", () => {
    const fixture = "-----------name--------------value\r\nfoo";
    const actual = matter(fixture);
    expect(actual.data).toEqual({});
    expect(actual.content).toBe("-----------name--------------value\r\nfoo");
  });
});
