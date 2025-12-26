import type { Language } from ".";
import parse from "./parse";

export default function stringify(matter: Record<string, any>, language: Language): string {
  switch (language) {
    case "toml":
      throw new Error(
        "TOML.stringify is not yet supported. See: https://github.com/oven-sh/bun/issues/22219",
      );
    case "json":
      try {
        const data = JSON.stringify(matter);
        if (typeof data !== "string" || data === "{}" || data == "") {
          return "";
        }
        return data;
      } catch (e) {
        throw new Error(`JSON.stringify failed due to ${e}`);
      }
    default:
      try {
        const parsed = Bun.YAML.stringify(matter, null, 2);
        if (typeof parsed !== "string" || parsed === "{}" || parsed == "") {
          return "";
        }
        return parsed;
      } catch (e) {
        throw new Error(`YAML.stringify failed due to ${e}`);
      }
  }
}
