import { getArtist, getArtistAlbums, WOODZ_ARTIST_ID } from "@/lib/spotify";
import { getCurationData } from "@/lib/notion";
import { ArtistHeader } from "@/components/artist-header";
import { AlbumGrid } from "@/components/album-grid";

// 라우트 세그먼트 레벨 캐싱: 이 페이지에서 발생하는 모든 fetch(Spotify/Notion)를
// 1시간(3600초) 주기로 재검증한다. `@notionhq/client`는 내부적으로 fetch 호출 시
// 자체 정의한 `init`(method/headers/body/agent)만 사용해 Next.js의 `next: { revalidate }`를
// 전달할 통로가 없으므로, 라우트 세그먼트 설정으로 캐싱 정책을 일괄 적용한다.
export const revalidate = 3600;

// 모든 데이터는 서버에서만 가져온다 (Spotify/Notion 키가 클라이언트에 노출되지 않음).
export default async function Home() {
  const [artist, albums, curationMap] = await Promise.all([
    getArtist(WOODZ_ARTIST_ID),
    getArtistAlbums(WOODZ_ARTIST_ID),
    getCurationData(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <ArtistHeader artist={artist} />
      <AlbumGrid albums={albums} curationMap={curationMap} />
    </main>
  );
}
