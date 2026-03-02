import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

export function writeCompareResult(
    filePath: string,
    sheetName: string,
    data: any[]
) {
    // 1. Đảm bảo thư mục data-output đã tồn tại. Nếu chưa có thì tự động tạo.
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    let workbook: XLSX.WorkBook;

    // 2. Kiểm tra xem file đã tồn tại chưa
    if (fs.existsSync(filePath)) {
        // Nếu có file -> Mở file Excel hiện có
        workbook = XLSX.readFile(filePath);

        // Nếu sheet đã tồn tại → xoá sheet cũ
        if (workbook.Sheets[sheetName]) {
            delete workbook.Sheets[sheetName];
            workbook.SheetNames = workbook.SheetNames.filter(
                (name) => name !== sheetName
            );
        }
    } else {
        // Nếu file chưa tồn tại -> Tạo một workbook mới hoàn toàn
        workbook = XLSX.utils.book_new();
    }

    // 3. Convert data → worksheet
    // (Xử lý thêm case mảng rỗng để không bị lỗi file Excel)
    const worksheet = data.length > 0
        ? XLSX.utils.json_to_sheet(data)
        : XLSX.utils.json_to_sheet([{ Message: "No data" }]);

    // 4. Append sheet mới
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 5. Ghi đè lại file
    XLSX.writeFile(workbook, filePath);
}