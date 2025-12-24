import type { Language, MatterOptions } from "./index";

export interface Engine {
  parse: Function;
  stringify?: Function;
}

export default function parse(language: Language, matter: string): unknown {
  switch (language.name) {
    case "TOML":
      return Bun.TOML.parse(matter);
    case "JSON":
      return JSON.parse(matter);
    default:
      const parsed = Bun.YAML.parse(matter);
      if (typeof parsed !== "object" || parsed === null) {
        return {};
      }
      return parsed;
  }
}
