import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe(".language", () => {
  it("should detect the name of the language to parse", () => {
    expect(matter.language("---\nfoo: bar\n---")).toBe({
      raw: "",
      name: "",
    });
    expect(matter.language("---js\nfoo: bar\n---")).toBe({
      raw: "js",
      name: "js",
    });
    expect(matter.language("---coffee\nfoo: bar\n---")).toBe({
      raw: "coffee",
      name: "coffee",
    });
  });

  it("should work around whitespace", () => {
    expect(matter.language("--- \nfoo: bar\n---")).toBe({
      raw: " ",
      name: "",
    });
    expect(matter.language("--- js \nfoo: bar\n---")).toBe({
      raw: " js ",
      name: "js",
    });
    expect(matter.language("---  coffee \nfoo: bar\n---")).toBe({
      raw: "  coffee ",
      name: "coffee",
    });
  });
});
