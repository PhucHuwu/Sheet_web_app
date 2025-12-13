# Hướng Dẫn Chạy Trên Máy Windows

## Yêu Cầu Trước

1. **Docker Desktop** - [Tải tại đây](https://www.docker.com/products/docker-desktop/)
2. **Node.js 18+** - [Tải tại đây](https://nodejs.org/)
3. **PostgreSQL 16** - [Tải tại đây](https://www.postgresql.org/download/windows/)
    - Khi cài đặt, đặt password: `Phuc3724@`
4. **Git** - [Tải tại đây](https://git-scm.com/download/win)

---

## Các Bước Chạy

### Bước 1: Clone repository

```powershell
git clone https://github.com/PhucHuwu/Sheet_web_app.git
cd Sheet_web_app
```

### Bước 2: Cài đặt pnpm (nếu chưa có)

```powershell
npm install -g pnpm
```

### Bước 3: Cài đặt lần đầu

```powershell
.\install.ps1
```

### Bước 4: Khởi động hệ thống

```powershell
.\start.ps1
```

### Bước 5: Mở trình duyệt

```
http://localhost:5173
```

---

## Tài Khoản Demo

| Username | Password  | Quyền      |
| -------- | --------- | ---------- |
| admin    | admin123  | Toàn quyền |
| editor1  | editor123 | Chỉnh sửa  |
| viewer1  | viewer123 | Chỉ xem    |

---

## Dừng Hệ Thống

```powershell
.\stop.ps1
```
