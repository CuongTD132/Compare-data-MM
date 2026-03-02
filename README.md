# Hướng dẫn sử dụng
### Thêm file data excel vào folder data-input
### Chỉnh sửa danh sách promotion theo thực tế trong listPromotions.ts
## Trong file .env cần thêm những thành phần sau:
### - Thêm đường dẫn đến file data excel tại EXCEL_FILE
### - Thêm đường dẫn đến trang MM tại URL
### - Thêm đường dẫn đến API của MM tại API_URL
####
# Hướng dẫn cài đặt và chạy test:
### Cài dependencies: `npm i`
### Chạy test: `npx playwright test`
### Xem báo cáo chi tiết trong file excel: `data-output/Report.xlsx`
