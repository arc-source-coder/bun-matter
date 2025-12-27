import parse from "./parse";
import serialize from "./serialize";

export type Language = "yaml" | "toml" | "json";
export type MatterInput = string | { content: string };

export interface ParsedMatter {
  content: string;
  data: Record<string, any>;
  matter: string;
  isEmpty: boolean;
  language?: Language;
}

interface MatterFunction {
  (input: MatterInput, options?: MatterOptions): ParsedMatter;
  cache: Record<string, ParsedMatter>;
  clearCache: () => void;
  stringify: (content: string, data: Record<string, any>, options?: MatterOptions) => string;
}

export interface MatterOptions {
  language?: Language;
  delimiters?: string | [string, string];
}

const languageMap: Record<string, Language> = {
  yaml: "yaml",
  yml: "yaml",
  toml: "toml",
  json: "json",
};

const defaultDelimiters: Record<string, Language> = {
  "---": "yaml",
  "+++": "toml",
  ";;;": "json",
};

function matterImpl(input: MatterInput, options?: MatterOptions): ParsedMatter {
  // handle empty input
  if (input === "") {
    return { data: {}, content: input, matter: "", isEmpty: true, language: undefined };
  }
  // normalize input
  const inputStr = typeof input === "string" ? input : input.content;
  let cached = matter.cache[inputStr];
  if (!options) {
    if (cached) {
      return Object.assign({}, cached);
    }
  }
  const parsed = parseMatter(inputStr, options);
  matter.cache[inputStr] = parsed;
  return parsed;
}

const matter = matterImpl as MatterFunction;
matter.cache = {};
matter.clearCache = () => (matter.cache = {});

export default matter;

function parseMatter(input: string, options?: MatterOptions): ParsedMatter {
  let opener = "---";
  let closer = "---";

  if (options?.delimiters) {
    if (typeof options.delimiters === "string") {
      opener = options.delimiters;
      closer = options.delimiters;
    } else {
      opener = options.delimiters[0];
      closer = options.delimiters[1];
    }
  } else {
    if (input.startsWith("+++")) {
      opener = "+++";
      closer = "+++";
    } else if (input.startsWith(";;;")) {
      opener = ";;;";
      closer = ";;;";
    }
  }

  // check if input starts with opening delimiter
  if (!input.startsWith(opener)) {
    return { content: input, data: {}, matter: "", isEmpty: true, language: undefined };
  }

  const openerLength = opener.length;
  // if the next character after the opening delimiter is
  // a character from the delimiter, then it's not a front-matter delimiter
  if (input.charAt(openerLength) === opener.slice(-1)) {
    return { content: input, data: {}, matter: "", isEmpty: true, language: undefined };
  }

  // strip the opening delimiter
  input = input.slice(openerLength);
  const { language, remaining } = determineLanguage(input, opener, options?.language);

  // find the closing delimiter
  const closingPattern = "\n" + closer; // TODO: test '\n---' inside frontmatter edge case

  // search for frontmatter closer in the first 1KB
  const searchLimit = Math.min(remaining.length, 1024);
  const initialRegion = remaining.slice(0, searchLimit);
  let closerIndex = initialRegion.indexOf(closingPattern);

  // If not found in first 1KB, search the entire string
  if (closerIndex === -1 && remaining.length > searchLimit) {
    closerIndex = remaining.indexOf(closingPattern, searchLimit);
  }

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

  // extract content after closer
  let content = "";
  if (closerIndex < remaining.length) {
    content = remaining.slice(closerIndex + closingPattern.length);

    if (content[0] === "\r") content = content.slice(1);
    if (content[0] === "\n") content = content.slice(1);
  }

  // return early if frontmatter is empty
  if (rawMatter.trim() === "") {
    return { content, data: {}, matter: rawMatter, isEmpty: true, language };
  }

  const data = parse(language, rawMatter) as Record<string, any>;
  return { content, data, matter: rawMatter, isEmpty: false, language };
}

function determineLanguage(
  input: string,
  opener: string,
  explicitLanguage?: Language,
): { language: Language; remaining: string } {
  let newlineIndex = input.indexOf("\n");
  if (newlineIndex === -1) newlineIndex = input.length;

  // Handle \r\n
  const lineEndIndex = input[newlineIndex - 1] === "\r" ? newlineIndex - 1 : newlineIndex;

  const languageHint = input.slice(0, lineEndIndex);
  const remainingInput = input.slice(newlineIndex + 1); // Skip the newline
  // const languageHint = input.match(/^([^\r\n]*)/)?.[0] ?? "";

  // Priority 1: Explicit language option
  if (explicitLanguage) {
    // strip language hints from the input (e.g., "---yaml\n...")
    return {
      language: explicitLanguage,
      remaining: remainingInput,
    };
  }

  // Priority 2: Language hint in content
  const language = languageHint.trim().toLowerCase();
  const mappedLanguage = languageMap[language];
  if (mappedLanguage !== undefined) {
    return { language: mappedLanguage, remaining: remainingInput };
  }

  // Priority 3: Default based on opening delimiter
  const detectedLanguage = defaultDelimiters[opener] ?? "yaml";
  const shouldStripHint = languageHint.length > 0;
  return {
    language: detectedLanguage,
    remaining: shouldStripHint ? remainingInput : input,
  };
}

matter.stringify = (
  content: string,
  data: Record<string, any>,
  options?: MatterOptions,
): string => {
  let opener = "---";
  let closer = "---";

  if (options?.delimiters) {
    if (typeof options.delimiters === "string") {
      opener = options.delimiters;
      closer = options.delimiters;
    } else {
      opener = options.delimiters[0];
      closer = options.delimiters[1];
    }
  }
  const { language } = determineLanguage("", opener, options?.language);
  const matter = serialize(data, language);
  if (matter === "") {
    return ensureNewline(content ?? "");
  }
  return ensureNewline([opener, matter, closer, content].join("\n"));
};

function ensureNewline(str: string): string {
  return str.endsWith("\n") ? str : str !== "" ? str + "\n" : str;
}
