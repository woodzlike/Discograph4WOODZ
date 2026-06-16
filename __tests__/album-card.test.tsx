import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { AlbumCard } from "@/components/album-card";
import type { SpotifyAlbum } from "@/types/spotify";
import type { CurationData } from "@/types/notion";

// next/image는 jsdom 환경에서 최적화 로직 없이 단순 img로 렌더링되도록 모킹한다
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt as string} src={props.src as string} />;
  },
}));

const baseAlbum: SpotifyAlbum = {
  id: "album-1",
  name: "WOODZ - SOLO",
  album_type: "album",
  total_tracks: 10,
  release_date: "2023-05-01",
  release_date_precision: "day",
  images: [{ url: "https://i.scdn.co/cover.jpg", height: 640, width: 640 }],
  external_urls: { spotify: "https://open.spotify.com/album/album-1" },
};

const curationWithHighlightAndRating: CurationData = {
  spotifyAlbumId: "album-1",
  highlight: true,
  fanNote: "정말 좋은 앨범",
  rating: 4,
};

describe("AlbumCard", () => {
  it("Notion 큐레이션 데이터가 없으면 배지와 별점을 렌더링하지 않는다", () => {
    render(<AlbumCard album={baseAlbum} curation={undefined} />);

    expect(screen.getByText("WOODZ - SOLO")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.queryByText("추천")).not.toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /별점/ })).not.toBeInTheDocument();
  });

  it("highlight가 true이고 rating이 있으면 배지와 별점을 모두 렌더링한다", () => {
    render(<AlbumCard album={baseAlbum} curation={curationWithHighlightAndRating} />);

    expect(screen.getByText("추천")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "별점 5점 만점에 4점" })).toBeInTheDocument();
  });

  it("highlight가 false이면 배지를 렌더링하지 않는다", () => {
    const curation: CurationData = {
      ...curationWithHighlightAndRating,
      highlight: false,
    };
    render(<AlbumCard album={baseAlbum} curation={curation} />);

    expect(screen.queryByText("추천")).not.toBeInTheDocument();
  });

  it("rating이 null이면 별점을 렌더링하지 않는다", () => {
    const curation: CurationData = {
      ...curationWithHighlightAndRating,
      rating: null,
    };
    render(<AlbumCard album={baseAlbum} curation={curation} />);

    expect(screen.queryByRole("img", { name: /별점/ })).not.toBeInTheDocument();
  });
});
