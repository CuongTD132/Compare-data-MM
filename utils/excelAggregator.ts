import { ExcelRow } from "./readExcel";

// Hàm aggregate dữ liệu Excel
// Kết quả:
// Map<storeCode, Map<promotionName, totalProducts>>
export function aggregateByCenterAndPromotion(
    rows: ExcelRow[]
): Map<number, Map<string, number>> {

    const result = new Map<number, Map<string, number>>();

    for (const row of rows) {
        const storeCode = row.storeCode;
        const promotion = row.promotionName;

        // Nếu center chưa tồn tại → tạo mới
        if (!result.has(storeCode)) {
            result.set(storeCode, new Map());
        }

        const promoMap = result.get(storeCode)!;

        // Mỗi dòng Excel = 1 sản phẩm
        // → tăng count lên 1
        promoMap.set(promotion, (promoMap.get(promotion) || 0) + 1);
    }

    return result;
}
