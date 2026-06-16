import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ArtistHeader } from "@/components/artist-header";
import type { SpotifyArtist } from "@/types/spotify";

const baseArtist: SpotifyArtist = {
  id: "artist-1",
  name: "WOODZ",
  images: [{ url: "https://i.scdn.co/profile.jpg", height: 640, width: 640 }],
  followers: { total: 123000 },
  external_urls: { spotify: "https://open.spotify.com/artist/artist-1" },
  genres: ["k-pop"],
};

describe("ArtistHeader", () => {
  it("팔로워 수가 있으면 축약된 형태로 렌더링한다", () => {
    render(<ArtistHeader artist={baseArtist} />);

    expect(screen.getByText("WOODZ")).toBeInTheDocument();
    expect(screen.getByText("팔로워 12.3만명")).toBeInTheDocument();
  });

  // PRD 검증 결과 followers 필드가 런타임에 내려오지 않는 경우가 있어
  // 옵셔널 체이닝 + fallback(렌더링 생략)으로 방어 처리했는지 확인한다
  it("followers 필드가 없어도 에러 없이 렌더링되고 팔로워 영역은 표시되지 않는다", () => {
    const artistWithoutFollowers = {
      ...baseArtist,
      followers: undefined,
    } as unknown as SpotifyArtist;

    render(<ArtistHeader artist={artistWithoutFollowers} />);

    expect(screen.getByText("WOODZ")).toBeInTheDocument();
    expect(screen.queryByText(/팔로워/)).not.toBeInTheDocument();
  });

  it("images 필드가 비어 있어도 에러 없이 렌더링된다", () => {
    const artistWithoutImages: SpotifyArtist = {
      ...baseArtist,
      images: [],
    };

    render(<ArtistHeader artist={artistWithoutImages} />);

    expect(screen.getByText("WOODZ")).toBeInTheDocument();
  });
});
