`docs/ROADMAP.md`의 체크박스를 실제 구현 상태에 맞춰 갱신한다.

대상 Phase: $ARGUMENTS (비워두면 전체 Phase를 검사한다)

## 작업 순서

1. `docs/ROADMAP.md`를 읽어 각 Phase의 "작업 목록" 체크박스와 맨 아래 "MVP 완료 기준 체크리스트"를 모두 파악한다.
2. 각 체크박스 항목에 대해, 추측하지 말고 코드베이스를 직접 확인해 완료 여부를 판단한다.
   - `lib/spotify.ts`, `lib/notion.ts`에 해당 함수(`getArtist`, `getArtistAlbums`, `getAlbumTracks`, `getCurationData` 등)가 실제로 구현되어 있는지 (Read/Grep)
   - `types/spotify.ts`, `types/notion.ts`에 해당 인터페이스가 정의되어 있는지
   - `components/`에 해당 컴포넌트(`AlbumCard`, `StarRating`, `FilterTabs`, `ArtistHeader` 등)가 존재하고 비어있지 않은지
   - `app/`에 해당 페이지(`/`, `/album/[id]`)가 존재하고 의미 있는 내용을 렌더링하는지
   - `next.config.ts`, `.env.local`(존재 여부만 — 값은 출력하지 않는다) 등 설정 파일 항목
   - 테스트/빌드 관련 항목은 실제로 `npm run build`, `npx tsc --noEmit`, `npm run lint`를 실행해 통과 여부로 판단한다
   - Vercel 배포 항목처럼 코드만으로 확인할 수 없는 항목은 사용자에게 직접 확인한다 (배포 URL 동작 여부 등을 임의로 "완료"로 단정하지 않는다)
3. 완료로 확인된 항목만 `- [ ]` → `- [x]`로 바꾼다. 이미 `[x]`인 항목은 실제로 코드가 사라졌거나 깨졌다는 명확한 근거가 없으면 다시 `[ ]`로 되돌리지 않는다.
4. 각 Phase의 "완료 기준" 산문 설명은 체크박스가 아니므로 수정하지 않는다 — 체크박스 항목만 갱신 대상이다.
5. 갱신 후 변경된 항목 목록을 다음 형식으로 요약해서 보고한다:
   - ✅ 체크함: 항목명 — 근거 파일/명령 (예: `lib/spotify.ts:42`에 `getArtist` 구현 확인)
   - ⬜ 미체크 유지: 항목명 — 미구현 또는 확인 불가 이유
6. 한 Phase의 모든 작업 목록 체크박스가 `[x]`가 되었는데 "완료 기준" 검증도 통과했다면, 사용자에게 다음 Phase로 진행할지 물어본다.

## 규칙

- `docs/ROADMAP.md` 외 다른 파일은 수정하지 않는다 (코드 수정은 이 커맨드의 범위가 아니다).
- 체크 여부 판단 근거가 불명확하면 체크하지 말고 "확인 필요"로 보고한다 — 임의로 완료 처리하지 않는다.
- `$ARGUMENTS`로 특정 Phase 번호(예: `1`, `2`)가 주어지면 해당 Phase의 작업 목록만 검사하고, 맨 아래 "MVP 완료 기준 체크리스트"는 관련된 항목만 함께 갱신한다.
