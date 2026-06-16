import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarRatingProps {
  /** 별점 (1~5 정수). 소수점 반별 처리는 Phase 4에서 다룬다 */
  rating: number
  /** 별 아이콘 크기를 조절하는 className (예: "size-4") */
  className?: string
}

/** 1~5점 별점을 별 아이콘으로 렌더링하는 컴포넌트 */
export function StarRating({ rating, className }: StarRatingProps) {
  // 1~5 범위를 벗어난 값이 들어와도 안전하게 클램핑한다
  const clampedRating = Math.min(5, Math.max(0, Math.round(rating)))

  return (
    <div
      role="img"
      aria-label={`별점 5점 만점에 ${clampedRating}점`}
      className="flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < clampedRating
        return (
          <Star
            key={index}
            aria-hidden="true"
            className={cn(
              "size-3.5",
              filled ? "fill-primary text-primary" : "fill-transparent text-muted-foreground",
              className
            )}
          />
        )
      })}
    </div>
  )
}
