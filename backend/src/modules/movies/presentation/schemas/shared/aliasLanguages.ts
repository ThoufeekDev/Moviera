export function aliasLanguages(val: unknown): unknown {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    const record = val as Record<string, unknown>;
    return {
      ...record,
      languageIds: record.languageIds ?? record.languages,
    };
  }
  return val;
}
