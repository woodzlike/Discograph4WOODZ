import { Client } from "@notionhq/client";
import type {
  DatabaseObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

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
