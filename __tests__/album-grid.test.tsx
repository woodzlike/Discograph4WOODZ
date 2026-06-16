import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { AlbumGrid } from "@/components/album-grid";
import type { SpotifyAlbum } from "@/types/spotify";
import type { CurationDataMap } from "@/types/notion";

// next/image는 jsdom 환경에서 단순 img로 렌더링되도록 모킹한다
// priority 값은 data-priority 속성으로 노출해 테스트에서 검증할 수 있게 한다
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        alt={props.alt as string}
        src={props.src as string}
        data-priority={String(props.priority ?? false)}
      />
    );
  },
}));

function createAlbum(overrides: Partial<SpotifyAlbum>): SpotifyAlbum {
  return {
    id: "album-1",
    name: "정규 앨범",
    album_type: "album",
    total_tracks: 10,
    release_date: "2023-05-01",
    release_date_precision: "day",
    images: [{ url: "https://i.scdn.co/cover.jpg", height: 640, width: 640 }],
    external_urls: { spotify: "https://open.spotify.com/album/album-1" },
    ...overrides,
  };
}

const albums: SpotifyAlbum[] = [
  createAlbum({ id: "regular-1", name: "정규앨범 1", album_type: "album", total_tracks: 10 }),
  createAlbum({ id: "ep-1", name: "EP 1", album_type: "album", total_tracks: 5 }),
  createAlbum({ id: "single-1", name: "싱글 1", album_type: "single", total_tracks: 1 }),
];

const emptyCurationMap: CurationDataMap = new Map();

describe("AlbumGrid", () => {
  it("기본값(전체 탭)에서는 모든 앨범을 렌더링한다", () => {
    render(<AlbumGrid albums={albums} curationMap={emptyCurationMap} />);

    expect(screen.getByText("정규앨범 1")).toBeInTheDocument();
    expect(screen.getByText("EP 1")).toBeInTheDocument();
    expect(screen.getByText("싱글 1")).toBeInTheDocument();
  });

  it("정규앨범 탭 선택 시 album_type=album이면서 트랙 수가 많은 앨범만 보인다", async () => {
    const user = userEvent.setup();
    render(<AlbumGrid albums={albums} curationMap={emptyCurationMap} />);

    await user.click(screen.getByRole("tab", { name: "정규앨범" }));

    expect(screen.getByText("정규앨범 1")).toBeInTheDocument();
    expect(screen.queryByText("EP 1")).not.toBeInTheDocument();
    expect(screen.queryByText("싱글 1")).not.toBeInTheDocument();
  });

  it("EP 탭 선택 시 album_type=album이면서 트랙 수가 적은 앨범만 보인다", async () => {
    const user = userEvent.setup();
    render(<AlbumGrid albums={albums} curationMap={emptyCurationMap} />);

    await user.click(screen.getByRole("tab", { name: "EP" }));

    expect(screen.queryByText("정규앨범 1")).not.toBeInTheDocument();
    expect(screen.getByText("EP 1")).toBeInTheDocument();
    expect(screen.queryByText("싱글 1")).not.toBeInTheDocument();
  });

  it("싱글 탭 선택 시 album_type=single인 앨범만 보인다", async () => {
    const user = userEvent.setup();
    render(<AlbumGrid albums={albums} curationMap={emptyCurationMap} />);

    await user.click(screen.getByRole("tab", { name: "싱글" }));

    expect(screen.queryByText("정규앨범 1")).not.toBeInTheDocument();
    expect(screen.queryByText("EP 1")).not.toBeInTheDocument();
    expect(screen.getByText("싱글 1")).toBeInTheDocument();
  });

  it("각 앨범 카드는 /album/[id] 상세 페이지로 연결되는 링크로 감싸진다", () => {
    render(<AlbumGrid albums={albums} curationMap={emptyCurationMap} />);

    const link = screen.getByText("정규앨범 1").closest("a");
    expect(link).toHaveAttribute("href", "/album/regular-1");
  });

  it("데스크탑 첫 행(4열)에 해당하는 앨범에만 priority가 true로 전달된다", () => {
    // 4열 그리드를 가득 채우고 한 장 더 있는 상황을 만들어 경계값을 검증한다
    const manyAlbums: SpotifyAlbum[] = [
      createAlbum({ id: "album-1", name: "앨범 1" }),
      createAlbum({ id: "album-2", name: "앨범 2" }),
      createAlbum({ id: "album-3", name: "앨범 3" }),
      createAlbum({ id: "album-4", name: "앨범 4" }),
      createAlbum({ id: "album-5", name: "앨범 5" }),
    ];

    render(<AlbumGrid albums={manyAlbums} curationMap={emptyCurationMap} />);

    const priorityFlags = manyAlbums.map(
      (album) => screen.getByAltText(`${album.name} 앨범 커버`).getAttribute("data-priority")
    );

    expect(priorityFlags).toEqual(["true", "true", "true", "true", "false"]);
  });
});
