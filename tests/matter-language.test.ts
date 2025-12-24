import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe(".language", () => {
  it("should detect the name of the language to parse", () => {
    expect(matter.language("---\nfoo: bar\n---")).toEqual({
      raw: "",
      name: "",
    });
    expect(matter.language("---toml\nfoo: bar\n---")).toEqual({
      raw: "toml",
      name: "TOML",
    });
    expect(matter.language("---json\nfoo: bar\n---")).toEqual({
      raw: "json",
      name: "JSON",
    });
  });

  it("should work around whitespace", () => {
    expect(matter.language("--- \nfoo: bar\n---")).toEqual({
      raw: " ",
      name: "",
    });
    expect(matter.language("--- toml \nfoo: bar\n---")).toEqual({
      raw: " toml ",
      name: "TOML",
    });
    expect(matter.language("---  json \nfoo: bar\n---")).toEqual({
      raw: "  json ",
      name: "JSON",
    });
  });
});
