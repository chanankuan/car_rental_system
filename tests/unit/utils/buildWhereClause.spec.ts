import { buildWhereClause } from "../../../src/utils/index.js";

describe("buildWhereClause", () => {
  it("builds WHERE and params correctly", () => {
    const { whereClause, params } = buildWhereClause([
      { column: "make", value: "Toyota" },
      { column: "seats", value: 4 },
    ]);

    expect(whereClause).toBe("WHERE make = $1 AND seats = $2");
    expect(params).toEqual(["Toyota", 4]);
  });

  it("ignores undefined values", () => {
    const { whereClause, params } = buildWhereClause([
      { column: "make", value: undefined },
    ]);

    expect(whereClause).toBe("");
    expect(params).toEqual([]);
  });
});
