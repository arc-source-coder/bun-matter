import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe(".stringify", () => {
  it("should stringify front-matter", () => {
    expect(matter.stringify({ name: "gray-matter" }, "Name: {{name}}\n")).toBe(
      ["---", "name: gray-matter", "---", "Name: {{name}}\n"].join("\n"),
    );
  });

  it("should stringify from a string", () => {
    expect(matter.stringify({}, "Name: {{name}}\n")).toBe("Name: {{name}}\n");
  });

  it("should use custom delimiters to stringify", () => {
    const data = { name: "gray-matter" };
    const actual = matter.stringify(data, "Name: {{name}}", { delimiters: "~~~" });
    expect(actual).toBe(["~~~", "name: gray-matter", "~~~", "Name: {{name}}\n"].join("\n"));
  });
});
