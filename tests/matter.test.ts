import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe(".test", () => {
  it("should return `true` if the string has front-matter:", () => {
    expect(matter.test("---\nabc: xyz\n---")).toBeTruthy();
    expect(matter.test("---\nabc: xyz\n---", { delims: "~~~" })).toBeFalsy();
    expect(matter.test("~~~\nabc: xyz\n~~~", { delims: "~~~" })).toBeTruthy();
    expect(matter.test("\nabc: xyz\n---")).toBeFalsy();
  });
});
