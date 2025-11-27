# API Documentation – Amazon Price Alert

## 상품 관련 API

### 1. 상품 등록 (POST /products)
새로운 상품을 추가한다.
필수 값: asin, title

요청 JSON 예시:
{
  "asin": "B0TEST1234",
  "title": "Example Product"
}

응답 JSON 예시:
{
  "id": "uuid",
  "asin": "B0TEST1234",
  "title": "Example Product",
  "created_at": "2025-11-27T00:00:00Z"
}

---

## 2. 상품 목록 조회 (GET /products)
등록된 모든 상품을 리스트로 반환한다.

응답 JSON 예시:
[
  {
    "id": "uuid",
    "asin": "B0TEST1234",
    "title": "Example Product"
  }
]

---

## 가격 히스토리 API

### 3. 특정 상품 가격 히스토리 조회 (GET /products/:id/prices)
상품의 가격 기록을 가져온다.

응답 JSON 예시:
[
  {
    "id": "uuid",
    "price": 92.13,
    "created_at": "2025-11-27T12:00:00Z"
  }
]

---

## 알림 설정 API

### 4. 알림 등록 (POST /alerts)
특정 상품에 대한 목표 가격을 설정한다.

요청 JSON 예시:
{
  "product_id": "uuid",
  "target_price": 80.0
}

응답 JSON 예시:
{
  "id": "uuid",
  "product_id": "uuid",
  "target_price": 80.0
}

---

## 5. 특정 상품 알림 조회 (GET /products/:id/alerts)
해당 상품에 설정된 알림 목록을 반환한다.

응답 JSON 예시:
[
  {
    "id": "uuid",
    "target_price": 80.0,
    "created_at": "2025-11-27"
  }
]

---

## 알림 대기열 API

### 6. 발생한 알림 조회 (GET /pending-alerts)
가격이 목표 이하일 때 생성되는 알림 대기 목록을 조회한다.

응답 JSON 예시:
[
  {
    "id": "uuid",
    "alert_id": "uuid",
    "price": 79.55,
    "created_at": "2025-11-27T14:00:00Z"
  }
]

---

## 자동 가격 수집 설명
cron 작업이 주기적으로 다음을 수행한다:
1. 모든 상품 목록 로드
2. Amazon 가격 조회(Mock)
3. prices 테이블에 저장
4. alerts 테이블의 target_price와 비교
5. target_price 이하라면 pending_alerts에 기록
