import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("defaults plain buttons to type=button", () => {
    render(
      <form>
        <Button>销毁</Button>
      </form>,
    );

    expect(screen.getByRole("button", { name: "销毁" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("preserves an explicit submit type", () => {
    render(
      <form>
        <Button type="submit">创建邮箱</Button>
      </form>,
    );

    expect(screen.getByRole("button", { name: "创建邮箱" })).toHaveAttribute(
      "type",
      "submit",
    );
  });
});
