# 📜 Changelog  
날짜별로 개발 변경 이력을 기록합니다.

---

## [2025-11-27]
### Added
- 가격 자동 수집 엔진(Cron) 구축
- priceService.js 구현 (자동 가격 저장)
- alertService.js 구현 (알림 조건 판단)
- pending_alerts 테이블 설계 및 적용
- 전체 cron 파이프라인 연결

### Changed
- supabase.js 모듈 export 방식 변경 (named export)

### Fixed
- cron import 오류 해결
- Flutter SDK 폴더 잠금 문제 해결

---

## [2025-11-18]
### Added
- Supabase 프로젝트 생성 및 연결 설정
- products / prices / alerts 테이블 구축
- Express 초기 서버 구성
- 상품 등록 API 구축
- 가격 기록(Mock) API 구축
- 알림 설정 API 구축
- GitHub 리포지토리 생성 & 첫 푸시 완료

---

## [2025-11-15]
### Added
- 프로젝트 초기 생성
- Node.js 기본 환경 세팅
