# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

## 개발 명령어

```bash
npm run dev          # 개발 서버 실행 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npm run test         # 테스트 watch 모드
npm run test:run     # 테스트 1회 실행
npm run test:coverage  # 커버리지 포함 실행
```

단일 테스트 파일 실행:

```bash
npx vitest run __tests__/sample.test.tsx
```

## shadcn 컴포넌트 추가

```bash
npx shadcn@latest add [컴포넌트명]
```

컴포넌트는 `components/ui/`에 자동으로 생성된다.

## 아키텍처

**Next.js 16 App Router** 기반. 페이지는 `app/` 하위에 폴더 단위로 구성한다.

### 스타일링

- **Tailwind CSS v4** — `tailwind.config.js` 없음. `app/globals.css`의 `@theme inline` 블록에서 CSS 변수로 토큰을 매핑한다.
- **색상 토큰**은 `oklch()` 값으로 `:root` / `.dark`에 정의되어 있다. 컴포넌트에서 직접 색상 값을 쓰지 말고 `bg-background`, `text-foreground` 등 시맨틱 토큰을 사용한다.
- **다크 모드**는 `.dark` 클래스 방식(`@custom-variant dark (&:is(.dark *))`)으로 동작한다. `next-themes`와 함께 사용한다.

### shadcn/ui

- `components.json` 기준: style `radix-nova`, RSC 활성화, 아이콘 `lucide-react`.
- 생성된 컴포넌트는 `components/ui/`에 위치하며 직접 수정 가능하다.

### 경로 별칭

`@/`는 프로젝트 루트를 가리킨다 (`tsconfig.json` 및 `vitest.config.ts` 모두 동일하게 설정).

```
@/components   →  components/
@/lib          →  lib/
@/hooks        →  hooks/
```

### 테스트

- **Vitest + jsdom + @testing-library/react** 조합. `vitest.setup.ts`에서 `@testing-library/jest-dom` 매처를 전역 등록한다.
- 테스트 파일은 `__tests__/` 폴더에 작성한다.

## 핵심 유틸리티

- `lib/utils.ts` — `cn()` 함수 (clsx + tailwind-merge). className 조합 시 항상 이 함수를 사용한다.

## 커스텀 슬래시 커맨드

- `/new-page [페이지명]` — `app/[페이지명]/page.tsx`를 템플릿으로 스캐폴딩한다 (`.claude/commands/new-page.md` 참고).
