import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe("language detection", () => {
  it("should detect YAML by default", () => {
    expect(matter("---\nfoo: bar\n---").language).toBe("yaml");
  });

  it("should detect language from hints", () => {
    expect(matter("---yaml\nfoo: bar\n---").language).toBe("yaml");
    expect(matter("---toml\nfoo= bar\n---").language).toBe("toml");
    expect(matter('---json\n{ "foo": "bar" }\n---').language).toBe("json");
  });

  it("should work around whitespace", () => {
    expect(matter("--- \nfoo: bar\n---").language).toBe("yaml");
    expect(matter("--- toml \nfoo= bar\n---").language).toBe("toml");
    expect(matter('---  json \n{"foo": "bar"   }\n---').language).toBe("json");
  });

  it("should detect TOML from +++ delimiters", () => {
    expect(matter("+++\nfoo = 'bar'\n+++").language).toBe("toml");
  });

  it("should detect JSON from ;;; delimiters", () => {
    expect(matter(';;;\n{ "foo": "bar"} \n;;;').language).toBe("json");
  });

  it("should trim whitespace from hints", () => {
    expect(matter("--- yaml \nfoo: bar\n---").language).toBe("yaml");
  });

  it("should respect explicit language option", () => {
    const result = matter("+++\nfoo: bar\n+++", { language: "yaml" });
    expect(result.language).toBe("yaml");

    expect(matter("+++yaml\nfoo = 'bar'\n+++").language).toBe("yaml");
    expect(matter(";;;toml\nfoo = 'bar'\n;;;").language).toBe("toml");
  });
});
