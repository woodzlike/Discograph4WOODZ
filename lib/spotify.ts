import type {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPagingObject,
  SpotifyTokenResponse,
  SpotifyTrack,
} from "@/types/spotify";

const SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

// WOODZ의 Spotify 아티스트 ID. 환경 변수로 덮어쓸 수 있도록 하되,
// 미설정 시에도 동작하도록 확인된 ID를 기본값으로 둔다.
export const WOODZ_ARTIST_ID =
  process.env.SPOTIFY_ARTIST_ID ?? "6y9nlaoynxSvoTGY09Vdcy";

// 페이지네이션 조회 시 한 번에 가져올 항목 수.
// 참고: `/artists/{id}/albums`는 문서상 최대 50이지만 실제로는 10을 넘기면
// 400(Invalid limit)을 반환하는 경우가 있어 보수적인 값을 사용한다.
const ALBUMS_PAGINATION_LIMIT = 10;
const TRACKS_PAGINATION_LIMIT = 50;

// 메모리에 액세스 토큰을 캐싱해 매 요청마다 새로 발급받지 않도록 한다.
// (서버리스 환경에서는 인스턴스가 재사용되는 동안에만 유효하다)
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Client Credentials Flow로 Spotify 액세스 토큰을 발급받는다.
 * 캐시된 토큰이 만료되지 않았으면 재사용한다.
 */
async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET 환경 변수가 설정되어 있지 않습니다.",
    );
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const response = await fetch(SPOTIFY_ACCOUNTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(
      `Spotify 액세스 토큰 발급 실패: ${response.status} ${response.statusText}`,
    );
  }

  const data: SpotifyTokenResponse = await response.json();

  cachedToken = data.access_token;
  // 만료 10초 전에 미리 갱신하도록 여유를 둔다.
  tokenExpiresAt = now + (data.expires_in - 10) * 1000;

  return cachedToken;
}

/**
 * Spotify Web API 호출 공통 래퍼.
 * 액세스 토큰 발급/첨부를 자동으로 처리한다.
 *
 * @param path `/artists/{id}`처럼 API 베이스 URL 이후의 경로
 */
export async function spotifyFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${SPOTIFY_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    // Phase 5에서 세부 캐싱 정책을 조정한다 (예: 1시간 revalidate).
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `Spotify API 요청 실패 (${path}): ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

/**
 * WOODZ 아티스트 정보를 조회한다 (프로필 이미지, 팔로워 수 등).
 */
export async function getArtist(artistId: string): Promise<SpotifyArtist> {
  return spotifyFetch<SpotifyArtist>(`/artists/${artistId}`);
}

/**
 * 페이지네이션 응답의 `next` 절대 URL에서 `spotifyFetch`가 받는 상대 경로
 * (베이스 URL 이후 부분)만 추출한다.
 */
function toRelativePath(nextUrl: string): string {
  return nextUrl.replace(SPOTIFY_API_BASE_URL, "");
}

/**
 * 아티스트의 전체 앨범/싱글/EP 목록을 조회한다.
 * `include_groups=album,single`로 정규 앨범과 싱글(EP 포함)만 가져오고,
 * 컴필레이션/참여(appears_on) 앨범은 제외한다.
 * 응답의 `next` 필드가 null이 될 때까지 페이지네이션을 반복해 전체 목록을 모은다.
 */
export async function getArtistAlbums(
  artistId: string,
): Promise<SpotifyAlbum[]> {
  const albums: SpotifyAlbum[] = [];

  const params = new URLSearchParams({
    include_groups: "album,single",
    limit: String(ALBUMS_PAGINATION_LIMIT),
  });
  let path: string | null = `/artists/${artistId}/albums?${params.toString()}`;

  while (path) {
    const page: SpotifyPagingObject<SpotifyAlbum> = await spotifyFetch(path);

    albums.push(...page.items);

    path = page.next ? toRelativePath(page.next) : null;
  }

  return albums;
}

/**
 * 앨범의 전체 트랙리스트를 조회한다.
 * 응답의 `next` 필드가 null이 될 때까지 페이지네이션을 반복해 전체 목록을 모은다.
 */
export async function getAlbumTracks(albumId: string): Promise<SpotifyTrack[]> {
  const tracks: SpotifyTrack[] = [];

  const params = new URLSearchParams({
    limit: String(TRACKS_PAGINATION_LIMIT),
  });
  let path: string | null = `/albums/${albumId}/tracks?${params.toString()}`;

  while (path) {
    const page: SpotifyPagingObject<SpotifyTrack> = await spotifyFetch(path);

    tracks.push(...page.items);

    path = page.next ? toRelativePath(page.next) : null;
  }

  return tracks;
}
