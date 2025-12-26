import type { Language } from "./index";

export default function serialize(dataObject: Record<string, any>, language: Language): string {
  switch (language) {
    case "toml":
      throw new Error(
        "TOML.stringify is not yet supported. See: https://github.com/oven-sh/bun/issues/22219",
      );
    case "json":
      try {
        const matter = JSON.stringify(dataObject, null, 2);
        if (matter === "{}" || matter == "") {
          return "";
        }
        return matter;
      } catch (e) {
        throw new Error(
          `JSON.stringify failed due to ${e instanceof Error ? e.message : String(e)}`,
        );
      }
    default:
      try {
        const string = Bun.YAML.stringify(dataObject, null, 2);
        if (string === "{}" || string == "" || string == undefined) {
          return "";
        }
        return string;
      } catch (e) {
        throw new Error(
          `YAML.stringify failed due to ${e instanceof Error ? e.message : String(e)}`,
        );
      }
  }
}
