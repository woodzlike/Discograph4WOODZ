새 App Router 페이지를 스캐폴딩한다.

페이지명: $ARGUMENTS

## 작업 순서

1. `app/$ARGUMENTS/` 폴더가 없으면 생성한다.
2. `app/$ARGUMENTS/page.tsx` 파일을 아래 템플릿으로 생성한다.

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "$ARGUMENTS",
  description: "",
};

export default function $ARGUMENTSPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold tracking-tight">$ARGUMENTS</h1>
    </main>
  );
}
```

## 규칙

- 페이지명이 kebab-case(`my-page`)이면 컴포넌트 함수명은 PascalCase(`MyPagePage`)로 변환한다.
- `metadata.title`은 페이지명을 그대로 사용하되, 첫 글자는 대문자로 한다.
- 파일이 이미 존재하면 덮어쓰지 말고 사용자에게 확인한다.
- 생성 완료 후 파일 경로를 출력한다.
