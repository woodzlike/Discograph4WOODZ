import type { SpotifyTokenResponse } from "@/types/spotify";

const SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

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
