/**
 * สร้างไฟล์ CSV ที่เปิดใน Microsoft Excel ภาษาไทยได้ไม่เพี้ยน (UTF-8 with BOM)
 */
export function buildCsvWithBom(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const escapeCell = (value: string | number | null | undefined): string => {
    const str = value === null || value === undefined ? "" : String(value);
    if (/[",\r\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ];

  // นำหน้าด้วย UTF-8 BOM (\uFEFF) เพื่อให้ Excel แสดงภาษาไทยถูกต้องทันที
  return `\uFEFF${lines.join("\r\n")}`;
}

