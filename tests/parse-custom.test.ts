import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe("custom parser:", function () {
  it("should allow a custom parser to be registered:", async () => {
    const file = await Bun.file("./tests/fixtures/lang-yaml.md").text();
    const actual = matter(file, {
      parser: function customParser(str: string, opts) {
        try {
          // TODO: Add opts
          return Bun.YAML.parse(str);
        } catch (err) {
          throw new SyntaxError(err);
        }
      },
    });

    expect(actual.data.title).toBe("YAML");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.hasOwnProperty("orig")).toBeTruthy();
  });
});
