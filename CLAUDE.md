# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

```bash
npm run dev      # 개발 서버 실행 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

## shadcn 컴포넌트 추가

```bash
npx shadcn@latest add [컴포넌트명]
# 예: npx shadcn@latest add button card dialog
```

컴포넌트는 `components/ui/`에 자동으로 생성된다.

## 아키텍처

- **Next.js 16 App Router** 기반. 페이지는 `app/` 하위에 폴더 단위로 구성한다.
- **Tailwind CSS v4** — `tailwind.config.js` 없이 `app/globals.css`의 `@theme` 블록에서 CSS 변수로 테마를 관리한다.
- **shadcn/ui** — `components.json` 설정 기준: style `radix-nova`, RSC 활성화, 아이콘 `lucide-react`.
- **경로 별칭** — `@/`는 프로젝트 루트를 가리킨다. `@/components`, `@/lib`, `@/hooks` 형태로 import한다.

## 핵심 유틸리티

- `lib/utils.ts` — `cn()` 함수 (clsx + tailwind-merge). className 조합 시 항상 이 함수를 사용한다.

## CSS 변수 / 다크 모드

`globals.css`의 `:root`와 `.dark` 블록에서 색상 토큰을 관리한다. 컴포넌트에서 직접 색상 값을 쓰지 말고 `bg-background`, `text-foreground` 등 시맨틱 토큰을 사용한다.  
다크 모드는 `.dark` 클래스 방식(`@custom-variant dark (&:is(.dark *))`)으로 동작한다.
