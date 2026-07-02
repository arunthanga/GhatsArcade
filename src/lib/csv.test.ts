import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("emits a header row from explicit columns in order", () => {
    const csv = toCsv(
      [{ a: 1, b: 2 }],
      [
        { key: "b", header: "B" },
        { key: "a", header: "A" },
      ],
    );
    expect(csv).toBe("B,A\r\n2,1");
  });

  it("derives the header from the first row when no columns given", () => {
    const csv = toCsv([{ name: "Asha", city: "Idukki" }]);
    expect(csv.split("\r\n")[0]).toBe("name,city");
  });

  it("quotes fields containing commas, quotes, or newlines", () => {
    const csv = toCsv(
      [{ note: 'He said "hi", then left', multi: "line1\nline2" }],
      [{ key: "note" }, { key: "multi" }],
    );
    expect(csv).toBe('note,multi\r\n"He said ""hi"", then left","line1\nline2"');
  });

  it("renders null/undefined as empty fields", () => {
    const csv = toCsv(
      [{ a: null, b: undefined, c: 0 }],
      [{ key: "a" }, { key: "b" }, { key: "c" }],
    );
    expect(csv).toBe("a,b,c\r\n,,0");
  });

  it("preserves leading/trailing spaces", () => {
    const csv = toCsv([{ a: "  padded  " }], [{ key: "a" }]);
    expect(csv).toBe("a\r\n  padded  ");
  });

  it("returns a header-only line when there are no rows but columns are given", () => {
    const csv = toCsv([], [{ key: "a", header: "A" }, { key: "b" }]);
    expect(csv).toBe("A,b");
  });

  it("returns an empty string when there are no rows and no columns", () => {
    expect(toCsv([])).toBe("");
  });

  it("joins multiple rows with CRLF", () => {
    const csv = toCsv([{ a: 1 }, { a: 2 }], [{ key: "a" }]);
    expect(csv).toBe("a\r\n1\r\n2");
  });
});
