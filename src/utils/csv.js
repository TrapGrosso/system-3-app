export function parseCsv(str) {
  if (!str) return [];
  return Array.from(
    new Set(
      str
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    )
  );
}

export function toCsv(arr) {
  if (!arr || arr.length === 0) return "";
  return arr.map((s) => String(s).trim()).filter(Boolean).join(",");
}
