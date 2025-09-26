import type { FilterDefinition } from "../types.js";

export function buildWhereClause(filters: FilterDefinition[]) {
  const where: string[] = [];
  const params: any[] = [];

  filters.forEach(filter => {
    if (filter.value !== undefined && filter.value !== null) {
      params.push(filter.value);
      where.push(`${filter.column} = $${params.length}`);
    }
  });

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  return { whereClause, params };
}
