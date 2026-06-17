// CSV serialization (Owner-only export, prj.md Section 9). Pure + dependency-free so
// the escaping rules are unit-tested independently of the export service/route.
//
// Follows RFC 4180: fields containing a comma, double-quote, CR or LF are wrapped in
// double quotes, and interior double-quotes are doubled. Rows are joined with CRLF.

export type CsvColumn = { key: string; header?: string };

const DELIMITER = ",";
const ROW_SEPARATOR = "\r\n";

function escapeField(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Resolve the column set: explicit columns win; otherwise use the first row's keys.
function resolveColumns(
  rows: ReadonlyArray<Record<string, unknown>>,
  columns?: CsvColumn[],
): CsvColumn[] {
  if (columns && columns.length > 0) {
    return columns;
  }
  const first = rows[0];
  return first ? Object.keys(first).map((key) => ({ key })) : [];
}

export function toCsv(
  rows: ReadonlyArray<Record<string, unknown>>,
  columns?: CsvColumn[],
): string {
  const cols = resolveColumns(rows, columns);
  if (cols.length === 0) {
    return "";
  }

  const headerLine = cols.map((col) => escapeField(col.header ?? col.key)).join(DELIMITER);
  const dataLines = rows.map((row) =>
    cols.map((col) => escapeField(row[col.key])).join(DELIMITER),
  );

  return [headerLine, ...dataLines].join(ROW_SEPARATOR);
}
