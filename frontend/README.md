# Frontend Developer Test — User Management System

## Tech Stack
- React 18 + Vite
- TailwindCSS + DaisyUI
- Zustand (state management)
- React Router v6
- Axios

## Setup & Run

```bash
# 1. รัน Backend ก่อน
docker compose up -d --build

# 2. ติดตั้ง dependencies
npm install

# 3. สร้างไฟล์ .env
cp .env.example .env

# 4. รัน Frontend
npm run dev
```

## Features
- แสดงรายการผู้ใช้ พร้อม department & address (null-safe)
- ค้นหา (debounce 300ms), กรองเพศ, กรองแผนก, เรียงลำดับ
- เพิ่ม / แก้ไข / ลบ ผู้ใช้ พร้อม address upsert/delete
- Confirmation dialog แสดงชื่อก่อนลบ
- หน้า Departments พร้อม user_count badge และรายชื่อ users (INNER JOIN)
- Navigate จาก Department → User detail
- URL sync query params ทุก filter/sort/page
- Loading / Empty / Error states ครบทุกหน้า
- Validation ฝั่ง frontend ตรงกับ backend rules
