import { test } from "@playwright/test";
import { readExcel } from "../utils/readExcel";
import { aggregateByCenterAndPromotion } from "../utils/excelAggregator";
import { listCenters } from "./data/listCenters";
import { listPromotions } from "./data/listPromotions";
import { getTotalProducts } from "../utils/apiClient";
import { writeCompareResult } from "../utils/writeResultExcel";

test("Compare Excel vs API totals (soft assert)", async () => {

    // Đọc toàn bộ dữ liệu từ file Excel
    const excelData = readExcel(process.env.EXCEL_FILE!);
    // Aggregate dữ liệu Excel theo:
    // Map<storeCode, Map<promotionName, total>>
    const excelSummary = aggregateByCenterAndPromotion(excelData);

    // Mảng lưu TẤT CẢ kết quả so sánh (match + mismatch)
    const allResults: any[] = [];

    // Loop qua từng promotion
    for (const promo of listPromotions) {
        // Với mỗi promotion, gọi API song song cho tất cả center
        const results = await Promise.all(
            listCenters.map(async (center) => {
                // Tổng sản phẩm lấy từ Excel
                let excelTotal = 0;
                // Lấy map promotion của store hiện tại
                const storeMap = excelSummary.get(center.storeCode);
                if (storeMap) {
                    // Case đặc biệt: MAIL = select all
                    // => ExcelTotal = tổng tất cả sub-promotion
                    if (promo.type === "TOTAL") {
                        for (const count of storeMap.values()) {
                            excelTotal += count;
                        }
                    } else {
                        // Promotion thường
                        // Lấy tổng theo đúng tên promotion
                        excelTotal = storeMap.get(promo.name.trim().toUpperCase()) ?? 0;
                    }
                }

                // Gọi API lấy tổng sản phẩm
                const apiTotal = await getTotalProducts(
                    center.storeCode,
                    promo.promotionId
                );

                // Trả về kết quả so sánh cho 1 store + 1 promotion
                return {
                    center: center.name,
                    storeCode: center.storeCode,
                    promotion: promo.name,
                    excelTotal,
                    apiTotal,
                };
            })
        );

        // Gom kết quả & xác định MATCH / MISMATCH
        for (const r of results) {
            allResults.push({
                ...r,
                status: r.excelTotal === r.apiTotal ? "MATCH" : "MISMATCH"
            });
        }
    }

    // Chuẩn hoá dữ liệu để ghi ra Excel
    const excelOutput = allResults.map((r, index) => ({
        STT: index + 1,
        Center: r.center,
        StoreCode: r.storeCode,
        Promotion: r.promotion,
        ExcelTotal: r.excelTotal,
        ApiTotal: r.apiTotal,
        Status: r.status,
    }));

    // Ghi sheet tổng hợp kết quả
    writeCompareResult(
        "data-output/Compared Data.xlsx",
        "COMPARE_RESULT",
        excelOutput
    );

    // Lọc ra các dòng không bị lệch
    const matchExcel = excelOutput.filter(
        r => r.Status === "MATCH"
    );

    // Ghi sheet chỉ chứa match
    writeCompareResult(
        "data-output/Compared Data.xlsx",
        "COMPARE_MATCH",
        matchExcel
    );

    // Lọc ra các dòng bị lệch
    const mismatchExcel = excelOutput.filter(
        r => r.Status === "MISMATCH"
    );

    // Ghi sheet chỉ chứa mismatch
    writeCompareResult(
        "data-output/Compared Data.xlsx",
        "COMPARE_MISMATCH",
        mismatchExcel
    );

    // Log ra console để debug nhanh
    console.table(excelOutput);
});

// Flow tổng quát:
// Excel → read → aggregate → loop center + promotion
// → call API → so sánh → ghi Excel (ALL + MISMATCH)
