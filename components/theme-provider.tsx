"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * next-themes의 ThemeProvider를 감싸는 클라이언트 컴포넌트.
 * app/layout.tsx(서버 컴포넌트)에서 직접 next-themes를 import하면
 * "use client" 경계가 모호해지므로, 별도 파일로 분리해 명확히 한다.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
