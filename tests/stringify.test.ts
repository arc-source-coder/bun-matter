import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe.skip(".stringify", () => {
  it("should stringify front-matter from a file object", () => {
    const file = { content: "Name: {{name}}\n", data: { name: "gray-matter" } };
    expect(matter.stringify(file)).toBe(
      ["---", "name: gray-matter", "---", "Name: {{name}}\n"].join("\n"),
    );
  });

  it("should stringify from a string", () => {
    expect(matter.stringify("Name: {{name}}\n")).toBe("Name: {{name}}\n");
  });

  it("should use custom delimiters to stringify", () => {
    const data = { name: "gray-matter" };
    const actual = matter.stringify("Name: {{name}}", data, { delims: "~~~" });
    expect(actual).toBe(["~~~", "name: gray-matter", "~~~", "Name: {{name}}\n"].join("\n"));
  });

  it("should stringify a file object", () => {
    const file = { content: "Name: {{name}}", data: { name: "gray-matter" } };
    const actual = matter.stringify(file);
    expect(actual).toBe(["---", "name: gray-matter", "---", "Name: {{name}}\n"].join("\n"));
  });

  it("should stringify an excerpt", () => {
    const file = {
      content: "Name: {{name}}",
      data: { name: "gray-matter" },
      excerpt: "This is an excerpt.",
    };
    expect(matter.stringify(file)).toBe(
      ["---", "name: gray-matter", "---", "This is an excerpt.", "---", "Name: {{name}}\n"].join(
        "\n",
      ),
    );
  });

  it("should not add an excerpt if it already exists", () => {
    const file = {
      content: "Name: {{name}}\n\nThis is an excerpt.",
      data: { name: "gray-matter" },
      excerpt: "This is an excerpt.",
    };

    expect(matter.stringify(file)).toBe(
      ["---", "name: gray-matter", "---", "Name: {{name}}\n\nThis is an excerpt.\n"].join("\n"),
    );
  });
});
