import Image from "next/image"
import { Sparkles } from "lucide-react"

import type { SpotifyAlbum } from "@/types/spotify"
import type { CurationData } from "@/types/notion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"

interface AlbumCardProps {
  album: SpotifyAlbum
  /** Notion 큐레이션 데이터. 없으면 배지/별점을 렌더링하지 않는다 */
  curation?: CurationData
}

/** Spotify 앨범 정보와 Notion 큐레이션 데이터를 함께 보여주는 카드 */
export function AlbumCard({ album, curation }: AlbumCardProps) {
  const coverImage = album.images[0]
  // release_date_precision이 "year"가 아니어도 앞 4자리는 항상 연도를 나타낸다
  const releaseYear = album.release_date.slice(0, 4)

  return (
    <Card className="w-full gap-3 py-3">
      <CardContent className="px-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={`${album.name} 앨범 커버`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover"
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
