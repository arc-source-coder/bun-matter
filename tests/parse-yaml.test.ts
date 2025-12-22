import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe("parse YAML:", () => {
  it("should parse YAML", () => {
    const file = matter.read("./test/fixtures/all.yaml");
    expect(file.data).toEqual({
      one: "foo",
      two: "bar",
      three: "baz",
    });
  });

  it("should parse YAML with closing ...", () => {
    const file = matter.read("./test/fixtures/all-dots.yaml");
    expect(file.data).toEqual({
      one: "foo",
      two: "bar",
      three: "baz",
    });
  });

  it("should parse YAML front matter", () => {
    const actual = matter.read("./test/fixtures/lang-yaml.md");
    expect(actual.data.title).toBe("YAML");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.hasOwnProperty("orig")).toBeTruthy();
  });

  it("should detect YAML as the language with no language defined after the first fence", () => {
    const actual = matter.read("./test/fixtures/autodetect-no-lang.md");
    expect(actual.data.title).toBe("autodetect-no-lang");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.hasOwnProperty("orig")).toBeTruthy();
  });

  it("should detect YAML as the language", () => {
    const actual = matter.read("./test/fixtures/autodetect-yaml.md");
    expect(actual.data.title).toBe("autodetect-yaml");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.hasOwnProperty("orig")).toBeTruthy();
  });

  it("should use safeLoad when specified", () => {
    const fixture =
      '---\nabc: xyz\nversion: 2\n---\n\n<span class="alert alert-info">This is an alert</span>\n';
    const actual = matter(fixture, { safeLoad: true });
    expect(actual.data).toEqual({ abc: "xyz", version: 2 });
    expect(actual.content).toBe(
      '\n<span class="alert alert-info">This is an alert</span>\n',
    );
    expect(actual.hasOwnProperty("orig")).toBeTruthy();
  });
});
