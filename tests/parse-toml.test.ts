import { describe, it, expect } from "bun:test";
import matter from "../src/index";

const defaults = {
  engines: { toml: Bun.TOML.parse.bind(Bun.TOML) },
};

function parse(str: string, options?) {
  return matter(str, Object.assign({}, defaults, options));
}

describe("parse TOML:", () => {
  it("should parse toml front matter.", () => {
    const actual = parse(
      '---\ntitle = "TOML"\ndescription = "Front matter"\ncategories = "front matter toml"\n---\n\n# This file has toml front matter!\n',
      { lang: "toml" },
    );
    expect(actual.data.title).toEqual("TOML");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.hasOwnProperty("orig")).toBeTruthy();
  });

  it("should auto-detect TOML as the language.", () => {
    const actual = parse(
      '---toml\ntitle = "autodetect-TOML"\n[props]\nuser = "jonschlinkert"\n---\nContent\n',
    );
    expect(actual.data.title).toEqual("autodetect-TOML");
    expect(actual.hasOwnProperty("data")).toBeTruthy();
    expect(actual.hasOwnProperty("content")).toBeTruthy();
    expect(actual.hasOwnProperty("orig")).toBeTruthy();
  });

  it("should throw on TOML syntax errors", () => {
    expect(() => {
      matter('---toml\n[props\nuser = "jonschlinkert"\n---\nContent\n');
    }).toThrow();
  });
});
