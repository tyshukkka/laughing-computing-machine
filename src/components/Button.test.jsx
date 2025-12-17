import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./Button";

describe("Button Component", () => {
  // 1. Рендеринг
  test("renders without crashing", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // 2. Props
  test("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("applies variant class", () => {
    const { rerender } = render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("button--primary");

    rerender(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("button--secondary");
  });

  // 3. Поведение
  test("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 4. Accessibility
  test("has accessible role", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
