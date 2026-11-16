const FORMULA_TRIGGER_RE = /^(?:[\t\r\n ]*[=+\-@]|[\t\r])/;

/**
 * สร้างไฟล์ CSV ที่เปิดใน Microsoft Excel ภาษาไทยได้ไม่เพี้ยน (UTF-8 with BOM)
 * และป้องกัน CSV Formula Injection สำหรับข้อความที่ขึ้นต้นด้วย =, +, -, @ หรือ Tab/CR
 */
export function buildCsvWithBom(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const escapeCell = (value: string | number | null | undefined): string => {
    const raw = value === null || value === undefined ? "" : String(value);
    const isFiniteNumber = typeof value === "number" && Number.isFinite(value);
    const safe = !isFiniteNumber && FORMULA_TRIGGER_RE.test(raw) ? `'${raw}` : raw;
    if (/[",\r\n]/.test(safe)) {
      return `"${safe.replace(/"/g, '""')}"`;
    }
    return safe;
  };

  const lines = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ];

  // นำหน้าด้วย UTF-8 BOM (\uFEFF) เพื่อให้ Excel แสดงภาษาไทยถูกต้องทันที
  return `\uFEFF${lines.join("\r\n")}`;
}

