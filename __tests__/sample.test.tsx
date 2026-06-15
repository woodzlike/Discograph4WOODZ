import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

function Hello({ name }: { name: string }) {
  return <p>안녕하세요, {name}!</p>;
}

describe("샘플 테스트", () => {
  it("이름이 렌더링된다", () => {
    render(<Hello name="Claude" />);
    expect(screen.getByText("안녕하세요, Claude!")).toBeInTheDocument();
  });
});
