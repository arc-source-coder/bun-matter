import { isDeleteExpression } from "typescript";
import parse from "./parse";
import stringify from "./stringify";

export type Language = "yaml" | "toml" | "json";
export type MatterInput = string | { content: string };

export interface ParsedMatter {
  data: any;
  content: string;
  matter: string;
  isEmpty: boolean;
  language?: Language;
}

export interface MatterOptions {
  language?: Language;
  delimiters?: string | [string, string];
}

export default function matter(input: MatterInput, options?: MatterOptions): ParsedMatter {
  // handle empty input
  if (input === "") {
    return { data: {}, content: input, matter: "", isEmpty: true, language: undefined };
  }
  // normalize input
  const inputStr = typeof input === "string" ? input : input.content;

  return parseMatter(inputStr, options);
}

function parseMatter(input: string, options?: MatterOptions): ParsedMatter {
  const [opener, closer] = normalizeDelimiters(input, options?.delimiters);
  const openerLength = opener.length;

  // check if input starts with opening delimiter
  if (!input.startsWith(opener)) {
    return { data: {}, content: input, matter: "", isEmpty: true, language: undefined };
  }

  // if the next character after the opening delimiter is
  // a character from the delimiter, then it's not a front-matter delimiter
  if (input.charAt(openerLength) === opener.slice(-1)) {
    return { data: {}, content: input, matter: "", isEmpty: true, language: undefined };
  }

  // strip the opening delimiter
  input = input.slice(openerLength);
  const { language, remaining } = determineLanguage(input, opener, options?.language);

  // find the closing delimiter
  const closingPattern = "\n" + closer; // TODO: test '\n---' inside frontmatter edge case
  let closerIndex = remaining.indexOf(closingPattern);

  // if no closer found, everything is frontmatter
  if (closerIndex === -1) {
    let fallback = remaining.length;
    if (language === "yaml") {
      const alternateClosingPattern = "\n" + "...";
      const alternateCloserIndex = remaining.indexOf(alternateClosingPattern);
      if (alternateCloserIndex !== -1) {
        fallback = alternateCloserIndex;
      }
    }
    closerIndex = fallback;
  }

  // extract the frontmatter block
  const rawMatter = remaining.slice(0, closerIndex);
  const matterBlock = rawMatter.replace(/^\s*#[^\n]+/gm, "").trim();

  // extract content after closer
  let content = "";
  if (closerIndex < remaining.length) {
    content = remaining.slice(closerIndex + closingPattern.length);

    if (content[0] === "\r") content = content.slice(1);
    if (content[0] === "\n") content = content.slice(1);
  }

  // return early if frontmatter is empty
  if (matterBlock === "") {
    return { data: {}, content, matter: rawMatter, isEmpty: true, language };
  }

  const data = parse(language, rawMatter);
  return { data, content, matter: rawMatter, isEmpty: false, language };
}

function normalizeDelimiters(
  input: string,
  delimiters?: string | [string, string],
): [string, string] {
  if (delimiters === undefined) {
    if (input.startsWith("+++")) return ["+++", "+++"];
    if (input.startsWith(";;;")) return [";;;", ";;;"];
    return ["---", "---"];
  }
  if (typeof delimiters == "string") return [delimiters, delimiters];
  return delimiters;
}

function determineLanguage(
  input: string,
  opener: string,
  explicitLanguage?: Language,
): { language: Language; remaining: string } {
  const languageHint = input.match(/^([^\r\n]*)/)?.[0] ?? "";

  // Priority 1: Explicit language option
  if (explicitLanguage) {
    // strip language hints from the input (e.g., "---yaml\n...")
    return {
      language: explicitLanguage,
      remaining: input.slice(languageHint.length),
    };
  }

  // Priority 2: Language hint in content
  const language = languageHint.trim().toLowerCase();
  const languageMap: Record<string, Language> = {
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    json: "json",
  };
  const mappedLanguage = languageMap[language];
  if (mappedLanguage !== undefined) {
    return { language: mappedLanguage, remaining: input.slice(languageHint.length) };
  }

  // Priority 3: Default based on opening delimiter
  const detectedLanguage = getDefaultLanguage(opener);
  const shouldStripHint = languageHint.length > 0;
  return {
    language: detectedLanguage,
    remaining: shouldStripHint ? input.slice(languageHint.length) : input,
  };
}

function getDefaultLanguage(opener: string): Language {
  const defaultDelimiters: Record<string, Language> = {
    "---": "yaml",
    "+++": "toml",
    ";;;": "json",
  };

  return defaultDelimiters[opener] ?? "yaml";
}

matter.stringify = (
  data: Record<string, any>,
  content?: string,
  options?: MatterOptions,
): string => {
  const [opener, closer] = normalizeDelimiters("", options?.delimiters);
  const { language } = determineLanguage("", opener, options?.language);
  const matter = stringify(data, language);
  if (matter === "") {
    return ensureNewline(content ? content : "");
  }
  return ensureNewline([opener, matter, closer, content].join("\n"));
};

function ensureNewline(str: string): string {
  return str.endsWith("\n") ? str : str + "\n";
}
