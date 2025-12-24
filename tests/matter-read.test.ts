import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe.skip(".read", () => {
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
