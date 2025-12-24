import { describe, it, expect } from "bun:test";
import matter from "../src/index";

describe("gray-matter", () => {
  it("should work with empty front-matter", () => {
    const file1 = matter("---\n---\nThis is content");
    expect(file1.content).toBe("This is content");
    expect(file1.data).toEqual({});

    const file2 = matter("---\n\n---\nThis is content");
    expect(file2.content).toBe("This is content");
    expect(file2.data).toEqual({});

    const file3 = matter("---\n\n\n\n\n\n---\nThis is content");
    expect(file3.content).toBe("This is content");
    expect(file3.data).toEqual({});
  });

  it("should keep content even if front matter is empty", () => {
    expect(matter("---\n---").content).toEqual("---\n---");
  });

  it("should update file.isEmpty to true", () => {
    expect(matter("---\n---").isEmpty).toEqual(true);
  });

  it("should work when front-matter has comments", () => {
    const fixture = "---\n # this is a comment\n# another one\n---";
    expect(matter(fixture).content).toEqual(fixture);
  });
});
