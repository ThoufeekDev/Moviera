export function generateSlug(value: string): string{
    return value.toLowerCase().trim().replace(/\s+/g,"-")
}