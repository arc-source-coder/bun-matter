import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe(".language", () => {
  it("should detect the name of the language to parse", () => {
    expect(matter("---\nfoo: bar\n---").language).toEqual({
      raw: "",
      name: "",
    });
    expect(matter("---toml\nfoo: bar\n---").language).toEqual({
      raw: "toml",
      name: "TOML",
    });
    expect(matter("---json\nfoo: bar\n---").language).toEqual({
      raw: "json",
      name: "JSON",
    });
  });

  it("should work around whitespace", () => {
    expect(matter("--- \nfoo: bar\n---").language).toEqual({
      raw: " ",
      name: "",
    });
    expect(matter("--- toml \nfoo: bar\n---").language).toEqual({
      raw: " toml ",
      name: "TOML",
    });
    expect(matter("---  json \nfoo: bar\n---").language).toEqual({
      raw: "  json ",
      name: "JSON",
    });
  });
});
