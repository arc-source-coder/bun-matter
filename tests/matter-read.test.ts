import path from "path";
import { describe, it, expect } from "bun:test";

import matter from "../src/index";
const fixture = path.join.bind(path, __dirname, "fixtures");

describe(".read", () => {
  it("should extract YAML front matter from files with content.", () => {
    const file = matter.read(fixture("basic.txt"));

    expect(file.hasOwnProperty("path")).toBeTruthy();
    expect(file.hasOwnProperty("data", { title: "Basic" })).toBeTruthy();
    expect(file.content).toBe("this is content.");
  });

  it("should parse complex YAML front matter.", () => {
    const file = matter.read(fixture("complex.md"));

    expect(file.hasOwnProperty("data")).toBeTruthy();
    expect(file.data.root).toBe("_gh_pages");

    expect(file.hasOwnProperty("path")).toBeTruthy();
    expect(file.hasOwnProperty("content")).toBeTruthy();
    expect(file.hasOwnProperty("orig")).toBeTruthy();
    expect(file.data.hasOwnProperty("root")).toBeTruthy();
  });

  it("should return an object when a file is empty.", () => {
    const file = matter.read(fixture("empty.md"));
    expect(file.hasOwnProperty("path")).toBeTruthy();
    expect(file.hasOwnProperty("data")).toBeTruthy();
    expect(file.hasOwnProperty("content")).toBeTruthy();
    expect(file.hasOwnProperty("orig")).toBeTruthy();
  });

  it("should return an object when no front matter exists.", () => {
    const file = matter.read(fixture("hasnt-matter.md"));
    expect(file.hasOwnProperty("path")).toBeTruthy();
    expect(file.hasOwnProperty("data")).toBeTruthy();
    expect(file.hasOwnProperty("content")).toBeTruthy();
    expect(file.hasOwnProperty("orig")).toBeTruthy();
  });

  it("should parse YAML files directly", () => {
    const file = matter.read(fixture("all.yaml"));
    expect(file.hasOwnProperty("path")).toBeTruthy();
    expect(file.hasOwnProperty("data")).toBeTruthy();
    expect(file.hasOwnProperty("content")).toBeTruthy();
    expect(file.hasOwnProperty("orig")).toBeTruthy();
    expect(file.data).toEqual({
      one: "foo",
      two: "bar",
      three: "baz",
    });
  });
});
