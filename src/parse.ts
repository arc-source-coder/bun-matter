import type { Language, MatterOptions } from "./index";

export interface Engine {
  parse: Function;
  stringify?: Function;
}

export default function parse(language: Language, matter: string): unknown {
  return Bun.YAML.parse(matter);
}
