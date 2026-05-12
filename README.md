# ecampus-fe

멋쟁이사자처럼 e-campus 프론트엔드 프로젝트입니다.
React + TypeScript + Vite 기반으로, 사용자/관리자 화면과 세션/과제/자료/공지 기능을 제공합니다.

## Tech Summary

- React 19 + TypeScript 5 + Vite 7
- React Router 7
- Tailwind CSS 4
- Zustand (persist)
- Axios (토큰 자동 첨부 + 재발급 재시도 인터셉터)

상세 스택은 [docs/tech-stack.md](./docs/tech-stack.md)를 참고하세요.

## Requirements

- Node.js 20 이상 권장
- npm 10 이상 권장

## Getting Started

1. 의존성 설치

```bash
npm install
```

2. 환경 변수 파일 생성 (`.env`)

```env
VITE_BASE_API_URL=<API_BASE_URL>
VITE_GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID>
VITE_GOOGLE_REDIRECT_URI=<GOOGLE_REDIRECT_URI>
```

3. 개발 서버 실행

```bash
npm run dev
```

기본 주소: `http://localhost:5173`

## Scripts

- `npm run dev`: 개발 서버 실행
- `npm run build`: 타입체크 + 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기
- `npm run lint`: ESLint 검사
- `npm run format`: Prettier 자동 포맷
- `npm run format:check`: Prettier 포맷 검사

## Project Structure

```txt
src/
  admin/   # 관리자 도메인
  auth/    # OAuth/인증 흐름
  shared/  # 공통 컴포넌트/레이아웃/API/유틸
  user/    # 사용자 도메인
docs/
  tech-stack.md
  folder-architecture.md
  code-convention.md
```

상세 폴더/라우팅 구조는 [docs/folder-architecture.md](./docs/folder-architecture.md)를 참고하세요.

## Routing Overview

- `/`: Google OAuth 콜백 처리
- `/auth/*`: 로그인/에러 페이지
- `/user/*`: 사용자 영역
- `/admin/*`: 관리자 영역

현재 `App.tsx`에서는 `RequireAccess` 가드가 주석 처리되어 있어, 라우트 보호 정책을 적용하려면 해당 부분을 활성화해야 합니다.

## Conventions

코드 스타일/네이밍 규칙은 [docs/code-convention.md](./docs/code-convention.md)에 정리되어 있습니다.

## Notes

- 테스트 스크립트(`npm test`)는 현재 정의되어 있지 않습니다.
