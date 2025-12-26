import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe(".stringify", () => {
  it("should stringify front-matter", () => {
    expect(matter.stringify("Name: {{name}}\n", { name: "gray-matter" })).toBe(
      ["---", "name: gray-matter", "---", "Name: {{name}}\n"].join("\n"),
    );
  });

  it("should stringify from a string", () => {
    expect(matter.stringify("Name: {{name}}\n", {})).toBe("Name: {{name}}\n");
    expect(matter.stringify("", {}, { delimiters: "---" })).toBe("");
  });

  it("should use custom delimiters to stringify", () => {
    const data = { name: "gray-matter" };
    const actual = matter.stringify("Name: {{name}}", data, { delimiters: "~~~" });
    expect(actual).toBe(["~~~", "name: gray-matter", "~~~", "Name: {{name}}\n"].join("\n"));
  });
});
