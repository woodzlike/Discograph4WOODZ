// Spotify Web API 응답에서 사용하는 공통 타입 정의
// 참고: https://developer.spotify.com/documentation/web-api

/** 앨범/아티스트 이미지 */
export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

/** 외부 링크 (Spotify 바로가기 등) */
export interface SpotifyExternalUrls {
  spotify: string;
}

/** 아티스트 정보 */
export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  followers: {
    total: number;
  };
  external_urls: SpotifyExternalUrls;
  genres: string[];
}

/** 앨범 타입 (정규/싱글/EP 구분) */
export type SpotifyAlbumType = "album" | "single" | "compilation";

/** 앨범 목록 조회(getArtistAlbums) 응답 항목 */
export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: SpotifyAlbumType;
  total_tracks: number;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  label?: string;
}

/** 트랙 정보 */
export interface SpotifyTrack {
  id: string;
  name: string;
  track_number: number;
  duration_ms: number;
  external_urls: SpotifyExternalUrls;
}

/** 페이지네이션이 적용된 목록 응답 (앨범 목록, 트랙 목록 등) */
export interface SpotifyPagingObject<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

/** Client Credentials Flow 토큰 발급 응답 */
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
