import type { Language } from "./index";

export interface Engine {
  parse: Function;
  stringify: Function;
}

export default function parse(language: Language, matter: string): unknown {
  switch (language) {
    case "toml":
      try {
        const result = Bun.TOML.parse(matter);
        if (typeof result !== "object" || result === null) {
          return {};
        }
        return result;
      } catch {
        throw new Error("Invalid TOML input");
      }
    case "json":
      try {
        const data = JSON.parse(matter);
        if (typeof data !== "object" || data === null) {
          return {};
        }
        return data;
      } catch {
        throw new Error("Invalid JSON input");
      }
    default:
      try {
        const parsed = Bun.YAML.parse(matter);
        if (typeof parsed !== "object" || parsed === null) {
          return {};
        }
        return parsed;
      } catch {
        throw new Error("Invalid YAML input");
      }
  }
}
