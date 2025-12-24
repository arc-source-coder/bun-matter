import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe("parse json:", () => {
  it("should parse JSON front matter.", async () => {
    const file = await Bun.file("./tests/fixtures/lang-json.md").text();
    const actual = matter(file, {
      lang: "json",
    });

    expect(actual.data.title).toBe("JSON");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.hasOwnProperty("orig")).toBeTruthy();
  });

  it("should auto-detect JSON as the language.", async () => {
    const file = await Bun.file("./tests/fixtures/autodetect-json.md").text();
    const actual = matter(file);

    expect(actual.data.title).toBe("autodetect-JSON");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.hasOwnProperty("orig")).toBeTruthy();
  });
});
