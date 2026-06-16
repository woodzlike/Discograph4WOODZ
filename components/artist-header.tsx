import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { SpotifyArtist } from "@/types/spotify"

interface ArtistHeaderProps {
  artist: SpotifyArtist
}

/** 팔로워 수를 "1.2만" 같은 한국어 단위로 축약한다 */
function formatFollowers(total: number): string {
  if (total >= 10000) {
    return `${(total / 10000).toFixed(1)}만`
  }
  return total.toLocaleString("ko-KR")
}

/** 아티스트 프로필 이미지, 이름, 팔로워 수를 보여주는 헤더 */
export function ArtistHeader({ artist }: ArtistHeaderProps) {
  const profileImage = artist.images?.[0]
  // 타입 정의상 필수 필드이지만, 실제 응답에는 followers가 내려오지 않을 수 있어
  // 옵셔널 체이닝으로 방어한다. 값이 없으면 팔로워 영역 자체를 렌더링하지 않는다
  const followersTotal = artist.followers?.total

  return (
    <header className="flex items-center gap-4">
      <Avatar size="lg" className="size-20 sm:size-24">
        <AvatarImage src={profileImage?.url} alt={`${artist.name} 프로필 이미지`} />
        <AvatarFallback>{artist.name.slice(0, 1)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          {artist.name}
        </h1>

        {/* followers.total이 없으면 팔로워 정보를 표시하지 않는다 */}
        {followersTotal != null ? (
          <p className="text-sm text-muted-foreground">
            팔로워 {formatFollowers(followersTotal)}명
          </p>
        ) : null}
      </div>
    </header>
  )
}
