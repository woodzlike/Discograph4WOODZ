"use client"

import { useState, type CSSProperties, type PointerEvent } from "react"
import Image from "next/image"
import { Sparkles } from "lucide-react"

import type { SpotifyAlbum } from "@/types/spotify"
import type { CurationData } from "@/types/notion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { cn } from "@/lib/utils"

interface AlbumCardProps {
  album: SpotifyAlbum
  /** Notion 큐레이션 데이터. 없으면 배지/별점을 렌더링하지 않는다 */
  curation?: CurationData
  /** LCP 최적화를 위해 above-the-fold(첫 행) 카드에만 true로 전달한다. 기본값 false */
  priority?: boolean
}

// 회전 각도가 과도해지지 않도록 ±MAX_TILT_DEG로 제한한다
const MAX_TILT_DEG = 8

/** 값을 [min, max] 범위로 제한한다 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Spotify 앨범 정보와 Notion 큐레이션 데이터를 함께 보여주는 카드 */
export function AlbumCard({ album, curation, priority = false }: AlbumCardProps) {
  const coverImage = album.images[0]
  // release_date_precision이 "year"가 아니어도 앞 4자리는 항상 연도를 나타낸다
  const releaseYear = album.release_date.slice(0, 4)

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [isHovering, setIsHovering] = useState(false)

  /**
   * 마우스 위치를 기준으로 카드를 입체적으로 기울인다.
   * - 터치/펜 입력(마우스가 아닌 포인터)에서는 동작하지 않는다 (모바일 대응)
   * - prefers-reduced-motion 사용자에게는 적용하지 않는다 (접근성 대응)
   */
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const rect = event.currentTarget.getBoundingClientRect()
    const ratioX = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const ratioY = clamp((event.clientY - rect.top) / rect.height, 0, 1)

    // 카드 중심(0.5, 0.5)을 기준으로 -1~1 범위로 변환한 뒤 최대 각도를 곱해 회전값을 구한다
    setTilt({
      rotateY: clamp((ratioX - 0.5) * 2 * MAX_TILT_DEG, -MAX_TILT_DEG, MAX_TILT_DEG),
      rotateX: clamp(-(ratioY - 0.5) * 2 * MAX_TILT_DEG, -MAX_TILT_DEG, MAX_TILT_DEG),
    })
    setIsHovering(true)
  }

  /** 마우스가 카드를 벗어나면 평면 상태(0deg)로 되돌린다 */
  function resetTilt() {
    setTilt({ rotateX: 0, rotateY: 0 })
    setIsHovering(false)
  }

  const tiltStyle: CSSProperties = {
    transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
  }

  return (
    <Card
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      style={tiltStyle}
      className={cn(
        "w-full gap-3 py-3 transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none",
        // 호버 중에는 그림자와 림 하이라이트를 강조해 입체감을 보강한다
        isHovering && "shadow-xl ring-foreground/20"
      )}
    >
      <CardContent className="px-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={`${album.name} 앨범 커버`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover"
              priority={priority}
            />
          ) : null}

          {/* Notion에서 추천 앨범으로 표시한 경우에만 배지를 노출한다 */}
          {curation?.highlight ? (
            <Badge className="absolute top-2 right-2 gap-1">
              <Sparkles aria-hidden="true" />
              추천
            </Badge>
          ) : null}
        </div>

        <div className="mt-3 flex flex-col gap-1">
          <p className="truncate font-heading text-sm font-medium text-foreground">
            {album.name}
          </p>
          <p className="text-xs text-muted-foreground">{releaseYear}</p>

          {/* rating이 null/undefined가 아닐 때만 별점을 렌더링한다 */}
          {curation?.rating != null ? (
            <StarRating rating={curation.rating} />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
