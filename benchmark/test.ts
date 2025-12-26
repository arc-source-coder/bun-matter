// Test 1: Raw parsing speed
const yamlContent = `title: Test
description: A test post
tags:
  - javascript
  - bun
date: 2025-12-26`;

console.time("Bun.YAML x1000");
for (let i = 0; i < 1000; i++) {
  Bun.YAML.parse(yamlContent);
}
console.timeEnd("Bun.YAML x1000");

const yaml = require("js-yaml");
console.time("js-yaml x1000");
for (let i = 0; i < 1000; i++) {
  yaml.load(yamlContent);
}
console.timeEnd("js-yaml x1000");
