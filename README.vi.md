# Ứng Dụng Univer Sheets

Ứng dụng chỉnh sửa bảng tính hợp tác với xác thực người dùng và phân quyền.

## Yêu Cầu

-   Docker Desktop (đang chạy)
-   Node.js 18+ với pnpm
-   PostgreSQL 16 (đang chạy)
-   Mật khẩu PostgreSQL: `Phuc3724@`

## Hướng Dẫn Nhanh

### Cài Đặt Lần Đầu (chạy 1 lần sau khi git clone)

```powershell
.\install.ps1
```

Script sẽ tự động:

-   Cài đặt các dependencies
-   Tạo database 'univer' trong PostgreSQL
-   Khởi tạo database schema

### Khởi Động Hệ Thống

```powershell
.\start.ps1
```

Mở trình duyệt: http://localhost:5173

### Dừng Hệ Thống

```powershell
.\stop.ps1
```

## Tài Khoản Demo

| Username | Password  | Quyền                  |
| -------- | --------- | ---------------------- |
| admin    | admin123  | Owner (toàn quyền)     |
| editor1  | editor123 | Editor (chỉ chỉnh sửa) |
| viewer1  | viewer123 | Reader (chỉ xem)       |

## Kiến Trúc

-   Frontend: http://localhost:5173 (Vite + Univer SDK)
-   USIP Server: http://localhost:3001 (Xác thực Node.js)
-   Univer Server: http://localhost:8000 (Docker)
-   Database: PostgreSQL local (localhost:5432)

## Các File Quan Trọng

| File                  | Mục đích                  |
| --------------------- | ------------------------- |
| `install.ps1`         | Script cài đặt lần đầu    |
| `start.ps1`           | Script khởi động hệ thống |
| `stop.ps1`            | Script dừng hệ thống      |
| `configs/config.yaml` | Cấu hình Univer Server    |
