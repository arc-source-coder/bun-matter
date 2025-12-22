# bun-matter

A fast, zero-dependency frontmatter parser built with Bun's native APIs. Supports YAML, TOML, and JSON frontmatter.
bun-matter is a drop-in replacement for [gray-matter](https://github.com/jonschlinkert/gray-matter).

Inspired by and based on [gray-matter](https://github.com/jonschlinkert/gray-matter) by Jon Schlinkert.

### Benchmarks

Coming soon

## Installation

```bash
bun add bun-matter
```

## Usage
bun-matter exposes the same public API as gray-matter, making it easy to switch.
 
```typescript
import matter from 'bun-matter';

const file = `
---
title: Hello World
date: 2025-12-22
---
# Content
`;

const parsed = matter(file);
console.log(parsed.data);    // { title: 'Hello World', date: '2025-12-22' }
console.log(parsed.content); // "# Content"
```

## Limitations

bun-matter intentionally does **not** support:
- CSON front-matter
- Coffeescript front-matter
- JavaScript front-matter parsing

If you need these formats, consider using [gray-matter](https://github.com/jonschlinkert/gray-matter).

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```
