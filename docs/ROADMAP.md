# ROADMAP: WOODZ 디스코그래피 아카이브

> PRD 기반 개발 로드맵. 각 단계는 이전 단계가 완료되어야 진행 가능하다.

---

## Phase 1. 프로젝트 초기 설정 (골격 구축)

> **왜 먼저?** 환경 변수, 유틸 함수, 폴더 구조가 없으면 이후 모든 작업이 흔들린다. 가장 먼저 단단한 기반을 세운다.

**예상 소요 시간**: 0.5일

### 작업 목록

- [ ] `.env.local` 생성 — Spotify Client ID/Secret, Notion API Key, Notion Database ID 세팅
- [ ] `lib/spotify.ts` — Spotify Client Credentials Flow 토큰 발급 및 fetch 래퍼 작성
- [ ] `lib/notion.ts` — Notion API 클라이언트 초기화 및 fetch 래퍼 작성
- [ ] 공통 타입 정의 (`types/spotify.ts`, `types/notion.ts`) — Album, Track, CurationData 인터페이스
- [ ] `next.config.ts` — Spotify 이미지 도메인(`i.scdn.co`) 허용 설정

### 완료 기준

- `.env.local` 값이 올바르게 로드된다
- `lib/spotify.ts`에서 액세스 토큰을 정상 발급받는다
- `lib/notion.ts`에서 Notion DB 응답을 정상 수신한다
- TypeScript 타입 오류 없음

---

## Phase 2. 공통 모듈 / 컴포넌트 개발

> **왜 먼저?** 핵심 기능 개발 전에 재사용 컴포넌트와 API 함수를 만들어두면, 이후 페이지 구현이 조립 수준으로 단순해진다.

**예상 소요 시간**: 1일

### 작업 목록

- [ ] Spotify API 함수 구현
  - `getArtist()` — WOODZ 아티스트 정보 (프로필 이미지, 팔로워 수)
  - `getArtistAlbums()` — 전체 앨범/EP/싱글 목록
  - `getAlbumTracks()` — 앨범별 트랙리스트
- [ ] Notion API 함수 구현
  - `getCurationData()` — DB 전체 조회 후 `spotify_album_id` 기준 Map으로 변환
- [ ] 공통 UI 컴포넌트
  - `AlbumCard` — 커버 이미지, 앨범명, 발매연도, 추천 배지, 별점 표시
  - `StarRating` — 1~5점 별점 렌더러
  - `FilterTabs` — 전체 / 정규앨범 / EP / 싱글 탭
  - `ArtistHeader` — 프로필 이미지, 아티스트명, 팔로워 수

### 완료 기준

- 각 API 함수가 올바른 타입의 데이터를 반환한다
- `AlbumCard`가 Notion 데이터 유무에 따라 배지·별점을 조건부 렌더링한다
- 페이지에서 컴포넌트를 단독으로 렌더링하여 시각 확인 가능

---

## Phase 3. 핵심 기능 개발

> **왜 이 순서?** MVP의 핵심 두 페이지(메인, 상세)를 완성한다. Phase 2에서 만든 모듈을 조립하는 단계다.

**예상 소요 시간**: 1.5일

### 작업 목록

- [ ] **메인 페이지 (`/`)** 구현
  - `ArtistHeader` 렌더링 (Spotify 아티스트 데이터)
  - `FilterTabs` + 탭 상태에 따른 앨범 목록 필터링
  - `AlbumCard` 그리드 렌더링 (Spotify + Notion 데이터 병합)
  - Notion 추천 배지(`highlight: true`) 오버레이
- [ ] **앨범 상세 페이지 (`/album/[id]`)** 구현
  - 앨범 커버, 제목, 발매일, 레이블 표시
  - 트랙리스트 (트랙 번호, 곡명, 재생 시간 포맷팅)
  - "Spotify에서 듣기" 외부 링크 버튼
  - Notion 팬 에디토리얼 노트 섹션 (데이터 있을 때만 표시)
- [ ] Next.js Server Component로 API 호출 처리 (클라이언트에 키 노출 방지)

### 완료 기준

- 메인 페이지에서 WOODZ 앨범 전체가 카드 그리드로 표시된다
- 필터 탭 전환 시 해당 타입 앨범만 표시된다
- 앨범 카드 클릭 시 상세 페이지로 이동하고 트랙리스트가 렌더링된다
- Notion에 `highlight: true`인 앨범에 배지가 표시된다
- Notion에 `fan_note`가 있는 앨범 상세 페이지에 노트 섹션이 표시된다
- 브라우저 네트워크 탭에서 API 키가 노출되지 않는다

---

## Phase 4. 추가 기능 개발

> **왜 이 순서?** 핵심 기능이 동작한 뒤 사용자 경험을 보완하는 단계다. 없어도 앱은 동작한다.

**예상 소요 시간**: 1일

### 작업 목록

- [ ] 로딩 상태 처리 — 앨범 그리드 Skeleton UI (`components/ui/skeleton` 활용)
- [ ] 에러 바운더리 — Spotify / Notion API 실패 시 fallback UI
- [ ] 반응형 레이아웃 — 모바일(1열) / 태블릿(2열) / 데스크탑(4열) 그리드
- [ ] 별점 시각화 개선 — `StarRating` 컴포넌트에 소수점 반별 처리
- [ ] `<head>` 메타 태그 — 앨범 상세 페이지 OG 이미지·타이틀 동적 생성 (`generateMetadata`)
- [ ] 앨범 상세 페이지 — 뒤로가기 버튼 (메인으로 복귀)

### 완료 기준

- 데이터 로딩 중 Skeleton이 표시된다
- API 오류 시 앱이 크래시되지 않고 에러 메시지를 표시한다
- 모바일 환경에서 레이아웃이 깨지지 않는다
- 앨범 상세 페이지 URL 공유 시 OG 미리보기가 올바르게 표시된다

---

## Phase 5. 최적화 및 배포

> **왜 마지막?** 동작하는 앱이 있어야 무엇을 최적화할지 알 수 있다.

**예상 소요 시간**: 0.5일

### 작업 목록

- [ ] Next.js `revalidate` 설정 — Spotify/Notion 데이터 캐싱 주기 설정 (예: 1시간)
- [ ] `next/image` — 앨범 커버 이미지 최적화 (`priority`, `sizes` 설정)
- [ ] `npm run build` 성공 확인 및 TypeScript / ESLint 오류 0건 확인
- [ ] Vercel 배포 — 환경 변수 세팅 후 프로덕션 배포
- [ ] 배포 후 실제 URL에서 전체 플로우 동작 확인

### 완료 기준

- `npm run build`가 경고 없이 통과한다
- Vercel 프로덕션 URL에서 메인 페이지와 앨범 상세 페이지가 정상 동작한다
- Lighthouse 성능 점수 80점 이상

---

## 전체 일정 요약

| Phase | 내용 | 예상 소요 |
|-------|------|-----------|
| 1 | 프로젝트 초기 설정 | 0.5일 |
| 2 | 공통 모듈 / 컴포넌트 | 1일 |
| 3 | 핵심 기능 (메인 + 상세 페이지) | 1.5일 |
| 4 | 추가 기능 (UX 보완) | 1일 |
| 5 | 최적화 및 배포 | 0.5일 |
| **합계** | | **4.5일** |

---

## MVP 완료 기준 체크리스트

- [ ] Spotify API로 WOODZ 전체 앨범 자동 수집
- [ ] 메인 앨범 카드 그리드 렌더링
- [ ] 앨범 타입 필터 (정규 / EP / 싱글)
- [ ] 앨범 클릭 시 트랙리스트 상세 페이지
- [ ] Notion API 연동 및 추천 배지·팬 노트 오버레이
