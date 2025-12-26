import { bench, run, group, summary } from "mitata";
import matter from "../src/index";
import grayMatter from "gray-matter";
import { Glob } from "bun";

// Collect all fixture files
const glob = new Glob("fixtures/**/*.md");

const fixtureFiles: string[] = [];

console.log(import.meta.dir);
for await (const file of glob.scan({ cwd: import.meta.dir })) {
  fixtureFiles.push(import.meta.dir + "/" + file);
}

const fileContents = await Promise.all(
  fixtureFiles.map(async (path) => await Bun.file(path).text()),
);

console.log(`Benchmarking with ${fileContents.length} markdown files\n`);

// Warmup
for (let i = 0; i < 10; i++) {
  fileContents.forEach((content) => {
    matter(content);
    grayMatter(content);
  });
}

summary(() => {
  group(`Parse ${fileContents.length} files (cache disabled)`, () => {
    bench("bun-matter", () => {
      for (const content of fileContents) {
        matter.clearCache();
        matter(content);
      }
    });

    bench("gray-matter", () => {
      for (const content of fileContents) {
        grayMatter.clearCache();
        grayMatter(content);
      }
    });
  });
});

// cache enabled benchmark
summary(() => {
  group(`Parse ${fileContents.length} files (cache enabled)`, () => {
    bench("bun-matter", () => {
      for (const content of fileContents) {
        matter(content);
      }
    });

    bench("gray-matter", () => {
      for (const content of fileContents) {
        grayMatter(content);
      }
    });
  });
});

// Stringify Benchmark
const sampleFile = fileContents[Math.floor(fileContents.length / 2)];
const parsed = matter(sampleFile);

summary(() => {
  group("Stringify (round-trip)", () => {
    bench("bun-matter", () => {
      matter.stringify(parsed.content, parsed.data);
    });

    bench("gray-matter", () => {
      grayMatter.stringify({ content: parsed.content, data: parsed.data });
    });
  });
});

await run({
  units: false,
  json: false,
  colors: true,
  min_max: true,
  avg: true,
  percentiles: false,
});
