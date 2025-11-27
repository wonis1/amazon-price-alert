# 🛒 Amazon Price Alert  
Flutter + Node.js + Supabase 기반 아마존 가격 알림 앱의 MVP 프로젝트입니다.  
사용자는 상품을 등록해두면, 서버가 자동으로 가격을 수집하고 목표 가격 이하로 떨어질 때 알림을 받을 수 있습니다.

---

## 📌 프로젝트 개요
이 프로젝트는 다음 3가지를 자동화하는 것을 목표로 합니다:

1. **상품 가격 자동 수집(크론 기반)**
2. **과거 가격 히스토리 저장**
3. **목표 가격 이하일 때 알림 발생**

현재는 **백엔드 가격 수집 엔진 + 알림 조건 판단 엔진**까지 완성되었으며,  
다음 단계로 **Flutter 앱 + Push 알림(FCM)** 구성을 진행 예정입니다.

---

## 🧱 기술 스택

### Backend
- Node.js (Express)
- Cron Scheduler
- Supabase (Postgres + Auth + Storage)
- JavaScript ES Modules

### Frontend (Upcoming)
- Flutter  
- Firebase Cloud Messaging (Push 알림)

---

## 🗂 폴더 구조

Amazon-price-Alert/  
├─ index.js  
├─ cron.js  
├─ supabase.js  
├─ services/  
│  ├─ priceService.js  
│  ├─ alertService.js  
├─ package.json  
├─ .gitignore  
└─ README.md  

---

## 🧩 DB 스키마 요약

### products  
- id  
- asin  
- title  
- created_at  

### prices  
- id  
- product_id  
- price  
- created_at  

### alerts  
- id  
- product_id  
- target_price  
- created_at  

### pending_alerts  
- id  
- alert_id  
- price  
- created_at  

---

## 🚀 실행 방법

### 1) 패키지 설치
npm install

### 2) 환경 변수 설정 (.env)
SUPABASE_URL=your_url  
SUPABASE_KEY=your_key  

### 3) 서버 실행
node index.js

### 4) 가격 자동 수집 실행
node cron.js

---

## 🎯 로드맵 (Next Steps)
- Flutter 프로젝트 생성  
- 상품 리스트/가격 그래프 UI 구축  
- Flutter ↔ Node.js API 연동  
- 알림 설정 UI  
- Firebase FCM Push 알림 구현  

---

## 👤 작성자
정재원 (Jaewon Jeong)

