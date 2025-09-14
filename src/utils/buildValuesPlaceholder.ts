/**
 * Generates a string of SQL value placeholders for use in parameterized queries.
 *
 * For example, for an INSERT statement with multiple rows and columns,
 * this function produces placeholders like:
 * "( $1, $2, $3 ), ( $4, $5, $6 ), ..."
 *
 * @param rows - The number of rows to insert.
 * @param cols - The number of columns per row.
 * @returns A string representing SQL placeholders for all rows and columns.
 *
 * Example:
 * buildValuesPlaceholders(2, 3)
 * // Returns: "($1, $2, $3), ($4, $5, $6)"
 */
export function buildValuesPlaceholders(rows: number, cols: number): string {
  return Array.from({ length: rows }, (_, i) => {
    const start = i * cols + 1;
    const placeholders = Array.from(
      { length: cols },
      (_, j) => `$${start + j}`
    );
    return `(${placeholders.join(", ")})`;
  }).join(", ");
}
