type Primitive = string | number | boolean | Date | null | undefined;

const escapeCell = (value: Primitive): string => {
  if (value === null || value === undefined) return '';
  const str =
    value instanceof Date ? value.toISOString() : String(value);
  const needsQuotes = /[",\n\r]/.test(str);
  const escaped = str.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
};

export const toCsv = <T extends Record<string, Primitive>>(
  rows: T[],
  columns: { key: keyof T; header: string }[]
): string => {
  const headerRow = columns.map((c) => escapeCell(c.header)).join(',');
  const dataRows = rows.map((row) =>
    columns.map((c) => escapeCell(row[c.key])).join(',')
  );
  return [headerRow, ...dataRows].join('\r\n');
};
