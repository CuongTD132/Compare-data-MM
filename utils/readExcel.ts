import * as XLSX from "xlsx";

// 1 dòng Excel = 1 sản phẩm
export interface ExcelRow {
    storeCode: number;      // Lấy từ cột "Store Code"
    promotionName: string; // Lấy từ cột "Promotion VN"
}

// Hàm đọc file Excel
export function readExcel(path: string): ExcelRow[] {
    // Đọc file Excel từ path
    const workbook = XLSX.readFile(path);

    // Lấy sheet đầu tiên
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert sheet thành mảng object
    // Key = header trong Excel
    const rows = XLSX.utils.sheet_to_json<any>(sheet);

    // Map dữ liệu raw → ExcelRow chuẩn
    return rows.map(row => ({
        // Ép kiểu về number (tránh string)
        storeCode: Number(row["Store Code"]),

        // Trim để tránh lỗi space thừa
        promotionName: String(row["Sub promotion VN"]).trim().toUpperCase(),
    }));
}
