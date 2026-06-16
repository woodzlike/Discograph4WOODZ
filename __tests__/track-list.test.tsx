import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { TrackList } from "@/components/track-list";
import type { SpotifyTrack } from "@/types/spotify";

function createTrack(overrides: Partial<SpotifyTrack>): SpotifyTrack {
  return {
    id: "track-1",
    name: "트랙 1",
    track_number: 1,
    duration_ms: 200000,
    external_urls: { spotify: "https://open.spotify.com/track/track-1" },
    ...overrides,
  };
}

describe("TrackList", () => {
  it("트랙 번호와 곡명을 렌더링한다", () => {
    const tracks: SpotifyTrack[] = [
      createTrack({ id: "t1", track_number: 1, name: "Feel the Pull" }),
      createTrack({ id: "t2", track_number: 2, name: "Drowning" }),
    ];

    render(<TrackList tracks={tracks} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Feel the Pull")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Drowning")).toBeInTheDocument();
  });

  it("duration_ms를 mm:ss 형식으로 포맷팅한다 (3분 5초)", () => {
    const tracks: SpotifyTrack[] = [
      createTrack({ id: "t1", duration_ms: 185000 }), // 3분 5초
    ];

    render(<TrackList tracks={tracks} />);

    expect(screen.getByText("3:05")).toBeInTheDocument();
  });

  it("60초 미만인 트랙도 0분 단위로 올바르게 포맷팅한다 (45초)", () => {
    const tracks: SpotifyTrack[] = [createTrack({ id: "t1", duration_ms: 45000 })];

    render(<TrackList tracks={tracks} />);

    expect(screen.getByText("0:45")).toBeInTheDocument();
  });

  it("10분 이상인 트랙도 올바르게 포맷팅한다 (10분 0초)", () => {
    const tracks: SpotifyTrack[] = [createTrack({ id: "t1", duration_ms: 600000 })];

    render(<TrackList tracks={tracks} />);

    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  it("빈 트랙 배열이면 아무 항목도 렌더링하지 않는다", () => {
    const { container } = render(<TrackList tracks={[]} />);

    expect(container.querySelectorAll("li")).toHaveLength(0);
  });
});
