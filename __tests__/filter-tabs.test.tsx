import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { FilterTabs } from "@/components/filter-tabs";

describe("FilterTabs", () => {
  it("전체/정규앨범/EP/싱글 탭을 모두 렌더링한다", () => {
    render(<FilterTabs activeTab="all" onTabChange={vi.fn()} />);

    expect(screen.getByRole("tab", { name: "전체" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "정규앨범" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "EP" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "싱글" })).toBeInTheDocument();
  });

  it("탭 클릭 시 onTabChange 콜백이 선택된 값과 함께 호출된다 (controlled)", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<FilterTabs activeTab="all" onTabChange={handleChange} />);

    await user.click(screen.getByRole("tab", { name: "EP" }));

    expect(handleChange).toHaveBeenCalledWith("ep");
  });

  it("activeTab prop에 따라 활성 탭이 결정된다 (상태를 직접 갖지 않음)", () => {
    render(<FilterTabs activeTab="single" onTabChange={vi.fn()} />);

    expect(screen.getByRole("tab", { name: "싱글" })).toHaveAttribute(
      "data-state",
      "active"
    );
    expect(screen.getByRole("tab", { name: "전체" })).toHaveAttribute(
      "data-state",
      "inactive"
    );
  });
});
