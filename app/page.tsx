import { getArtist, getArtistAlbums, WOODZ_ARTIST_ID } from "@/lib/spotify";
import { getCurationData } from "@/lib/notion";
import { ArtistHeader } from "@/components/artist-header";
import { AlbumGrid } from "@/components/album-grid";

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
