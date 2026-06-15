# PRD: WOODZ 디스코그래피 아카이브

## 프로젝트 개요

- **프로젝트명**: WOODZ 디스코그래피 아카이브 (WOODZ Archive)
- **목적**: Spotify API로 WOODZ(우즈)의 음악 데이터를 자동 수집하고, Notion을 CMS로 활용해 팬 큐레이션 콘텐츠를 관리하는 디스코그래피 아카이브
- **CMS 선택 이유**: Notion API를 활용하여 비개발자도 추천 앨범 설정, 팬 노트 작성 등 콘텐츠 관리 가능. 디스코그래피 원본 데이터는 Spotify에서 자동 수집하므로 수동 입력 부담 없음

---

## 주요 기능

1. **자동 디스코그래피 수집**: Spotify Web API를 통해 WOODZ의 전체 앨범/싱글/EP 목록을 자동으로 불러와 카드 그리드로 표시
2. **앨범 상세 페이지**: 앨범 클릭 시 트랙리스트, 발매일, Spotify 바로가기 링크, 총 트랙 수 등 상세 정보 표시
3. **Notion 큐레이션 레이어**: Notion 데이터베이스에서 관리하는 추천 앨범 하이라이트 및 팬 에디토리얼 노트를 앨범 카드에 오버레이

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 16, TypeScript |
| 음악 데이터 | Spotify Web API (Client Credentials Flow) |
| CMS | Notion API |
| Styling | Tailwind CSS, shadcn/ui |
| Icons | Lucide React |

---

## Notion 데이터베이스 구조

Notion DB는 Spotify 앨범 ID를 키로 연결하며, 큐레이션 정보만 관리한다.

| 필드명 | 타입 | 설명 |
|--------|------|------|
| `spotify_album_id` | Text | Spotify 앨범 ID (Spotify 데이터와 연결하는 키) |
| `highlight` | Checkbox | 추천 앨범 여부 (카드에 배지 표시) |
| `fan_note` | Text | 팬 에디토리얼 노트 (앨범 상세 페이지에 표시) |
| `rating` | Number | 별점 (1–5, 카드에 시각적으로 표시) |

---

## 화면 구성

### 메인 페이지 (`/`)
- WOODZ 아티스트 헤더 (프로필 이미지, 이름, 팔로워 수)
- 앨범 타입 필터 탭 (전체 / 정규앨범 / EP / 싱글)
- 앨범 카드 그리드: 커버 이미지, 앨범명, 발매연도, Notion 추천 배지, 별점

### 앨범 상세 페이지 (`/album/[id]`)
- 앨범 커버, 제목, 발매일, 레이블
- 트랙리스트 (트랙 번호, 곡명, 재생 시간)
- Spotify에서 듣기 버튼
- Notion 팬 에디토리얼 노트 섹션 (등록된 경우에만 표시)

---

## MVP 범위

MVP에 포함할 최소 기능:

- [ ] Spotify API 연동 및 WOODZ 전체 앨범 자동 수집
- [ ] 메인 앨범 카드 그리드 렌더링
- [ ] 앨범 타입 필터 (정규 / EP / 싱글)
- [ ] 앨범 클릭 시 트랙리스트 상세 페이지
- [ ] Notion API 연동 및 추천 배지·팬 노트 오버레이

MVP에서 제외:

- 음원 미리듣기 플레이어 (Spotify Premium 필요)
- 좋아요 / 북마크 기능 (로그인 시스템 필요)
- 검색 기능

---

## 구현 단계

1. **환경 설정**: `.env.local`에 Spotify Client ID/Secret, Notion API Key 세팅. `lib/spotify.ts`, `lib/notion.ts` 유틸 작성
2. **Spotify 연동**: WOODZ 아티스트 정보 및 앨범 목록 fetch 함수 구현. 메인 페이지 카드 그리드 UI 완성
3. **Notion 큐레이션 연동**: Notion DB fetch 함수 구현. 앨범 ID 기준으로 Spotify 데이터와 병합하여 추천 배지·팬 노트 렌더링
