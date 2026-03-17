import { ExcelRow } from "./readExcel";

/**
 * Hàm tổng hợp dữ liệu từ Excel theo Cửa hàng và Chương trình khuyến mãi.
 * Trả về Map: StoreCode -> Map(PromotionName -> Số lượng sản phẩm không trùng lặp)
 */
export function aggregateByCenterAndPromotion(
    rows: ExcelRow[]
): Map<number, Map<string, number>> {

    // Bước 1: Khởi tạo một Map tạm thời để gom nhóm dữ liệu.
    // Cấu trúc: StoreCode -> Map(PromotionName -> Set các mã sản phẩm)
    // Dùng Set ở đây để tự động loại bỏ các mã sản phẩm bị trùng lặp.
    const temp = new Map<number, Map<string, Set<string>>>();

    for (const row of rows) {
        // Trích xuất và chuẩn hóa dữ liệu từ từng dòng
        const storeCode = row.storeCode;
        const promotion = row.promotionName.trim().toUpperCase(); // Xóa khoảng trắng và viết hoa để đồng nhất
        const articleCode = row.articleCode;

        // Nếu cửa hàng này chưa tồn tại trong Map tạm, hãy khởi tạo mới
        if (!temp.has(storeCode)) {
            temp.set(storeCode, new Map());
        }

        const promoMap = temp.get(storeCode)!;

        // Nếu chương trình khuyến mãi này chưa tồn tại trong cửa hàng, khởi tạo một Set mới
        if (!promoMap.has(promotion)) {
            promoMap.set(promotion, new Set());
        }

        // Thêm mã sản phẩm vào Set. Nếu mã đã tồn tại, Set sẽ không thêm trùng.
        promoMap.get(promotion)!.add(articleCode);
    }

    // Bước 2: Chuyển đổi cấu trúc từ Set (danh sách mã) sang Number (số lượng đếm được)
    const result = new Map<number, Map<string, number>>();

    for (const [store, promoMap] of temp) {
        const newPromoMap = new Map<string, number>();

        for (const [promo, articleSet] of promoMap) {
            // Lấy kích thước của Set (số lượng sản phẩm duy nhất)
            newPromoMap.set(promo, articleSet.size);
        }

        // Lưu kết quả cuối cùng cho từng cửa hàng
        result.set(store, newPromoMap);
    }

    return result;
}