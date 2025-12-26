import { describe, it, expect } from "bun:test";
import matter from "../src/index";
import path from "path";

const fixture = path.join.bind(path, __dirname, "fixtures");

describe("parse YAML:", () => {
  it("should parse YAML", async () => {
    const file = await Bun.file("./tests/fixtures/all.yaml").text();
    const actual = matter(file);
    expect(actual.data).toEqual({
      one: "foo",
      two: "bar",
      three: "baz",
    });
  });

  it("should parse YAML with closing ...", async () => {
    const file = await Bun.file("./tests/fixtures/all-dots.yaml").text();
    const actual = matter(file);
    expect(actual.data).toEqual({
      one: "foo",
      two: "bar",
      three: "baz",
    });
  });

  it("should parse YAML front matter", async () => {
    const file = await Bun.file("./tests/fixtures/lang-yaml.md").text();
    const actual = matter(file);
    expect(actual.data.title).toBe("YAML");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
  });

  it("should detect YAML as the language with no language defined after the first fence", async () => {
    const file = await Bun.file("./tests/fixtures/autodetect-no-lang.md").text();
    const actual = matter(file);
    expect(actual.data.title).toBe("autodetect-no-lang");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
  });

  it("should detect YAML as the language", async () => {
    const file = await Bun.file("./tests/fixtures/autodetect-yaml.md").text();
    const actual = matter(file);
    expect(actual.data.title).toBe("autodetect-yaml");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
  });

  it("should extract YAML front matter from files with content.", async () => {
    const file = await Bun.file(fixture("basic.txt")).text();
    const actual = matter(file);

    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.content).toBe("this is content.");
  });

  it("should parse complex YAML front matter.", async () => {
    const file = await Bun.file(fixture("complex.md")).text();
    const actual = matter(file);

    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.data.root).toBe("_gh_pages");

    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.data.hasOwnProperty("root")).toBeTruthy();
  });

  it("should return an object when a file is empty", async () => {
    const file = await Bun.file(fixture("empty.md")).text();
    const actual = matter(file);
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
  });

  it("should return an object when no front matter exists", async () => {
    const file = await Bun.file(fixture("hasnt-matter.md")).text();
    const actual = matter(file);
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
  });

  it("should parse YAML files directly", async () => {
    const file = await Bun.file(fixture("all.yaml")).text();
    const actual = matter(file);
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.data).toEqual({
      one: "foo",
      two: "bar",
      three: "baz",
    });
  });
});
