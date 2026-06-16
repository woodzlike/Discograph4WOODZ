"use client"

import { useEffect, useState } from "react"
import { Moon, Sun, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/** 라이트 / 다크 / 시스템 테마를 전환하는 토글 버튼 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // next-themes는 마운트 전(서버 렌더링 시점)에는 실제 테마를 알 수 없다.
  // 마운트 여부를 추적해, 마운트되기 전까지는 아이콘을 고정값으로 렌더링해
  // 서버/클라이언트 렌더링 결과가 어긋나는 hydration mismatch를 방지한다.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // next-themes 공식 가이드의 hydration mismatch 방지 패턴(mounted 가드)이다.
    // 외부 시스템(브라우저의 실제 테마 값)이 확정된 이후 한 번만 렌더링을 갱신하므로
    // 의도적으로 effect 내에서 setState를 호출한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="테마 변경">
          {mounted && theme === "dark" ? (
            <Moon aria-hidden="true" />
          ) : mounted && theme === "light" ? (
            <Sun aria-hidden="true" />
          ) : (
            <SunMoon aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun aria-hidden="true" />
          라이트
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon aria-hidden="true" />
          다크
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <SunMoon aria-hidden="true" />
          시스템
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
