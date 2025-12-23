export default function stringify(matter: unknown): string {
  return Bun.YAML.stringify(matter);
}
