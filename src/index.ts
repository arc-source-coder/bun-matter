import parse from "./parse";
import stringify from "./stringify";
import type { Engine } from "./parse";
import { DEFAULT_OPTIONS } from "./defaults";
import { isObjectLiteralElementLike } from "typescript";

export type MatterInput = string | { content: string };

export interface Language {
  raw: string;
  name: string | undefined;
}

export interface ParsedMatter {
  data: Object;
  content: string;
  orig: string;
  excerpt?: string;
  language?: Language;
  matter?: string;
  path?: string;
  isEmpty?: boolean;
  empty?: string;
}

export interface MatterOptions {
  excerpt?: boolean | Function;
  excerpt_separator?: string;
  engines?: { engine: Function } | { engine: Engine };
  delimiters?: [string, string?];
  language?: string;
}

export default function matter(input: MatterInput, opts?: MatterOptions): ParsedMatter {
  if (input === "") return { data: {}, content: input, excerpt: "", orig: input };

  const original = typeof input === "string" ? input : input.content;
  const options: Required<MatterOptions> = { ...DEFAULT_OPTIONS, ...opts };
  return parseMatter(original, options);
}

matter.stringify = (object: unknown): string => {
  // This is a stub
  return stringify(object);
};

matter.language = (input: string, options: MatterOptions): Language => {
  let opener = "---";
  if (options !== undefined) {
    if (options.delimiters !== undefined) {
      opener = options.delimiters[0];
    }
  }
  return detectLanguage(input, opener);
};

function detectLanguage(input: string, opener: string): Language {
  if (input.slice(0, opener.length) == opener) {
    input = input.slice(opener.length);
  }
  let language = input.slice(0, input.search(/\r?\n/));
  const raw = language;
  language = language.trim().toLowerCase();
  const languageMap: Record<string, string> = {
    yaml: "YAML",
    yml: "YAML",
    toml: "TOML",
    json: "JSON",
  };
  language = languageMap[language] ?? "";

  return {
    raw: raw,
    name: language ? language : "",
  };
}

function parseMatter(original: string, options: Required<MatterOptions>): ParsedMatter {
  let input = original;
  const opener = options.delimiters[0];
  const closer = "\n" + options.delimiters[1];

  const openerLength = opener.length;

  let isEmpty = false;
  let empty = "";
  let data = {};
  let content = "";

  if (input.slice(0, openerLength) !== opener) {
    return { data: {}, content: original, excerpt: original, orig: original };
  }

  // if the next character after the opening delimiter is
  // a character from the delimiter, then it's not a front-matter delimiter
  if (input.charAt(openerLength) === opener.slice(-1)) {
    // TODO: fix
    return { data: {}, content: original, excerpt: original, orig: original };
  }

  // strip the opening delimiter
  input = input.slice(openerLength);
  const length = input.length;

  // TODO: detect language
  const language = detectLanguage(input, opener);

  // strip language from the input
  input = input.slice(language.raw.length);

  // get the index of the closing delimiter
  let closerIndex = input.indexOf(closer);
  if (closerIndex === -1) {
    closerIndex = length;
  }
  // get the raw front-matter block
  let matter = input.slice(0, closerIndex);

  const block = matter.replace(/^\s*#[^\n]+/gm, "").trim();
  if (block === "") {
    isEmpty = true;
    empty = original;
  } else {
    // create data (frontmatter) by parsing the raw matter block
    data = parse(language, matter) as Object;
  }

  // update content
  if (closerIndex !== length) {
    content = input.slice(closerIndex + closer.length);
    if (content[0] === "\r") {
      content = content.slice(1);
    }
    if (content[0] === "\n") {
      content = content.slice(1);
    }
  }

  // TODO: implement excerpt handling

  return {
    data: data,
    content: content,
    excerpt: "",
    orig: original,
    isEmpty: isEmpty,
    empty: empty,
  };
}
