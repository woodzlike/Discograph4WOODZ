"use client"

import { useState } from "react"
import Link from "next/link"

import type { SpotifyAlbum } from "@/types/spotify"
import type { CurationDataMap } from "@/types/notion"
import { AlbumCard } from "@/components/album-card"
import { FilterTabs, type AlbumFilterValue } from "@/components/filter-tabs"

interface AlbumGridProps {
  /** Spotify에서 가져온 WOODZ 전체 앨범/싱글 목록 */
  albums: SpotifyAlbum[]
  /** spotify_album_id 기준 Notion 큐레이션 데이터 맵 */
  curationMap: CurationDataMap
}

// Spotify API의 album_type은 "album" | "single" | "compilation"만 제공하며
// EP를 구분하는 별도 필드가 없다. 국내 가요계 통상 기준(6트랙 이하)을 빌려
// album_type이 "album"이면서 total_tracks가 적은 경우를 EP로 간주해 1차 분류한다.
// 정확한 EP 여부는 추후 Notion 큐레이션 데이터 등으로 보완이 필요하다.
const EP_MAX_TRACK_COUNT = 6

// 데스크탑 기준 그리드가 4열(lg:grid-cols-4)이므로 첫 행에 해당하는 앨범 수만큼만
// priority를 부여해 LCP를 최적화한다. 전체 카드에 priority를 주면 우선순위 의미가 사라지므로
// above-the-fold로 간주되는 첫 행 개수만 상수로 분리해 관리한다.
const PRIORITY_CARD_COUNT = 4

/** 필터 탭 값에 맞춰 앨범 목록을 분류한다 */
function filterAlbums(albums: SpotifyAlbum[], filter: AlbumFilterValue): SpotifyAlbum[] {
  switch (filter) {
    case "album":
      return albums.filter(
        (album) => album.album_type === "album" && album.total_tracks > EP_MAX_TRACK_COUNT
      )
    case "ep":
      return albums.filter(
        (album) => album.album_type === "album" && album.total_tracks <= EP_MAX_TRACK_COUNT
      )
    case "single":
      return albums.filter((album) => album.album_type === "single")
    case "all":
    default:
      return albums
  }
}

/** 필터 탭 상태를 직접 관리하며 앨범 카드 그리드를 렌더링하는 클라이언트 래퍼 */
export function AlbumGrid({ albums, curationMap }: AlbumGridProps) {
  const [activeTab, setActiveTab] = useState<AlbumFilterValue>("all")
  const filteredAlbums = filterAlbums(albums, activeTab)

  return (
    <div className="flex flex-col gap-6">
      <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filteredAlbums.map((album, index) => (
          <Link key={album.id} href={`/album/${album.id}`}>
            <AlbumCard
              album={album}
              curation={curationMap.get(album.id)}
              priority={index < PRIORITY_CARD_COUNT}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
