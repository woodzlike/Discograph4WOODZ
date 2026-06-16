// Notion 큐레이션 데이터베이스 관련 타입 정의
// PRD 문서 참고: spotify_album_id를 키로 Spotify 데이터와 연결한다

/** Notion 큐레이션 DB의 한 레코드(앨범 1개에 대한 큐레이션 정보) */
export interface CurationData {
  /** Spotify 앨범 ID (Spotify 데이터와 연결하는 키) */
  spotifyAlbumId: string;
  /** 추천 앨범 여부 (카드에 배지 표시) */
  highlight: boolean;
  /** 팬 에디토리얼 노트 (앨범 상세 페이지에 표시) */
  fanNote: string;
  /** 별점 (1~5) */
  rating: number | null;
}

/** spotify_album_id를 키로 하는 큐레이션 데이터 맵 */
export type CurationDataMap = Map<string, CurationData>;
