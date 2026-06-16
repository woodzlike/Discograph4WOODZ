import { Client } from "@notionhq/client";
import type {
  DatabaseObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { CurationData, CurationDataMap } from "@/types/notion";

const notionToken = process.env.NOTION_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

if (!notionToken) {
  throw new Error("NOTION_TOKEN 환경 변수가 설정되어 있지 않습니다.");
}

if (!notionDatabaseId) {
  throw new Error("NOTION_DATABASE_ID 환경 변수가 설정되어 있지 않습니다.");
}

/** Notion API 클라이언트 (전역 1회 초기화) */
export const notion = new Client({ auth: notionToken });

/** 큐레이션 데이터베이스 ID */
export const NOTION_DATABASE_ID = notionDatabaseId;

// Notion API 2025-09-03+ 버전부터 데이터베이스 조회(query)는 database가 아닌
// 하위 data source 단위로 이뤄진다. database_id로 data_source_id를 1회 조회해 캐싱한다.
let cachedDataSourceId: string | null = null;

async function getDataSourceId(): Promise<string> {
  if (cachedDataSourceId) {
    return cachedDataSourceId;
  }

  const database = await notion.databases.retrieve({
    database_id: NOTION_DATABASE_ID,
  });

  const dataSourceId = (database as DatabaseObjectResponse).data_sources?.[0]
    ?.id;

  if (!dataSourceId) {
    throw new Error(
      `Notion 데이터베이스(${NOTION_DATABASE_ID})에서 data source를 찾을 수 없습니다.`,
    );
  }

  cachedDataSourceId = dataSourceId;
  return cachedDataSourceId;
}

/**
 * 큐레이션 데이터베이스 전체를 조회하는 fetch 래퍼.
 * 페이지네이션(`start_cursor`)을 한 번에 처리해 모든 레코드를 모아서 반환한다.
 * 레코드를 `CurationData`로 가공하는 로직은 Phase 2의 `getCurationData()`에서 담당한다.
 */
export async function queryNotionDatabase(): Promise<PageObjectResponse[]> {
  const dataSourceId = await getDataSourceId();
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
    });

    results.push(...(response.results as PageObjectResponse[]));
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results;
}

/**
 * Notion 페이지의 `properties`에서 특정 속성 값을 가져온다.
 * 존재하지 않는 속성명을 조회할 수도 있으므로 방어적으로 `undefined`를 허용한다.
 */
function getProperty(
  page: PageObjectResponse,
  propertyName: string,
): PageObjectResponse["properties"][string] | undefined {
  return page.properties[propertyName];
}

/**
 * `rich_text` 또는 `title` 타입 속성에서 plain_text를 안전하게 추출하는 헬퍼.
 * 속성이 비어 있거나 타입이 다르면 빈 문자열을 반환한다.
 */
function getPlainText(
  property: PageObjectResponse["properties"][string] | undefined,
): string {
  if (!property) {
    return "";
  }

  if (property.type === "rich_text") {
    return property.rich_text.map((item) => item.plain_text).join("");
  }

  if (property.type === "title") {
    return property.title.map((item) => item.plain_text).join("");
  }

  return "";
}

/**
 * `checkbox` 타입 속성에서 boolean 값을 안전하게 추출하는 헬퍼.
 */
function getCheckbox(
  property: PageObjectResponse["properties"][string] | undefined,
): boolean {
  if (!property || property.type !== "checkbox") {
    return false;
  }

  return property.checkbox;
}

/**
 * `number` 타입 속성에서 숫자 값을 안전하게 추출하는 헬퍼.
 */
function getNumber(
  property: PageObjectResponse["properties"][string] | undefined,
): number | null {
  if (!property || property.type !== "number") {
    return null;
  }

  return property.number;
}

/**
 * Notion 큐레이션 데이터베이스 전체를 조회해 `spotify_album_id`를 키로 하는
 * `CurationDataMap`으로 변환한다. `spotify_album_id`가 비어 있는 레코드는 제외한다.
 */
export async function getCurationData(): Promise<CurationDataMap> {
  const pages = await queryNotionDatabase();
  const curationDataMap: CurationDataMap = new Map();

  for (const page of pages) {
    const spotifyAlbumId = getPlainText(getProperty(page, "spotify_album_id"));

    // 키가 될 spotify_album_id가 없는 레코드는 Spotify 데이터와 연결할 수 없으므로 제외한다.
    if (!spotifyAlbumId) {
      continue;
    }

    const curationData: CurationData = {
      spotifyAlbumId,
      highlight: getCheckbox(getProperty(page, "highlight")),
      fanNote: getPlainText(getProperty(page, "fan_note")),
      rating: getNumber(getProperty(page, "rating")),
    };

    curationDataMap.set(spotifyAlbumId, curationData);
  }

  return curationDataMap;
}
