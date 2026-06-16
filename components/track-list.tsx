import type { SpotifyTrack } from "@/types/spotify"

interface TrackListProps {
  tracks: SpotifyTrack[]
}

/** 밀리초 단위 재생 시간을 "mm:ss" 형식 문자열로 변환한다 */
function formatDuration(durationMs: number): string {
  const totalSeconds = Math.round(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/** 앨범 트랙리스트를 트랙 번호, 곡명, 재생 시간과 함께 렌더링한다 */
export function TrackList({ tracks }: TrackListProps) {
  return (
    <ol className="flex flex-col divide-y divide-border">
      {tracks.map((track) => (
        <li
          key={track.id}
          className="flex items-center gap-4 py-3 text-sm text-foreground"
        >
          <span className="w-6 shrink-0 text-right text-muted-foreground">
            {track.track_number}
          </span>
          <span className="flex-1 truncate">{track.name}</span>
          <span className="shrink-0 text-muted-foreground">
            {formatDuration(track.duration_ms)}
          </span>
        </li>
      ))}
    </ol>
  )
}
