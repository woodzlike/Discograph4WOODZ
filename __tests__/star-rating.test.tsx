import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { StarRating } from "@/components/star-rating";

describe("StarRating", () => {
  it("rating 값에 맞는 접근성 레이블을 렌더링한다", () => {
    render(<StarRating rating={3} />);

    expect(screen.getByRole("img", { name: "별점 5점 만점에 3점" })).toBeInTheDocument();
  });

  it("항상 5개의 별 아이콘을 렌더링한다", () => {
    const { container } = render(<StarRating rating={2} />);

    expect(container.querySelectorAll("svg")).toHaveLength(5);
  });

  it("범위를 벗어난 값(예: 6)은 5로 클램핑된다", () => {
    render(<StarRating rating={6} />);

    expect(screen.getByRole("img", { name: "별점 5점 만점에 5점" })).toBeInTheDocument();
  });
});
