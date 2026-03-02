interface promotion{
    name: string
    promotionId: number
    type?: "TOTAL"
}
export const listPromotions: promotion[] = [
    { name: "MUA NHIỀU LỢI NHIỀU", promotionId: 167 },
    { name: "THƯƠNG HIỆU RIÊNG", promotionId: 168 },
    { name: "GIÁ SỈ", promotionId: 169 },
    { name: "MAIL 2605 DINH DƯỠNG CHO MỌI NHÀ", promotionId: 180, type: "TOTAL" },
]