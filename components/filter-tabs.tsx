"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

/** 앨범 타입 필터 값. 메인 페이지의 필터링 로직에서도 동일한 타입을 사용한다 */
export type AlbumFilterValue = "all" | "album" | "ep" | "single"

const FILTER_OPTIONS: { value: AlbumFilterValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "album", label: "정규앨범" },
  { value: "ep", label: "EP" },
  { value: "single", label: "싱글" },
]

interface FilterTabsProps {
  /** 현재 활성화된 탭 값 */
  activeTab: AlbumFilterValue
  /** 탭 변경 시 호출되는 콜백. 상태는 부모(페이지)에서 관리한다 */
  onTabChange: (value: AlbumFilterValue) => void
}

/** 전체 / 정규앨범 / EP / 싱글 필터 탭 (controlled 컴포넌트) */
export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as AlbumFilterValue)}
    >
      <TabsList>
        {FILTER_OPTIONS.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
