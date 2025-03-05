export function getExcerpt(content: string, length: number = 72): string {
  return content.slice(0, length)
}
