import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe("parse json:", () => {
  it("should parse JSON front matter.", () => {
    const actual = matter.read("./test/fixtures/lang-json.md", {
      lang: "json",
    });

    expect(actual.data.title).toBe("JSON");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.hasOwnProperty("orig")).toBeTruthy();
  });

  it("should auto-detect JSON as the language.", () => {
    const actual = matter.read("./test/fixtures/autodetect-json.md");

    expect(actual.data.title).toBe("autodetect-JSON");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.hasOwnProperty("orig")).toBeTruthy();
  });
});
