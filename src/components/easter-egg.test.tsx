import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { EasterEgg } from "./easter-egg";

afterEach(cleanup);

function type(keys: string) {
  for (const key of keys) fireEvent.keyDown(window, { key });
}

describe("EasterEgg", () => {
  it("stays quiet until ynwa is typed", () => {
    render(<EasterEgg />);

    type("yn");
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("shows the note after ynwa", () => {
    render(<EasterEgg />);

    act(() => type("ynwa"));
    expect(screen.getByRole("status")).toHaveTextContent("You'll never walk alone.");
  });

  it("ignores typing inside form fields", () => {
    render(
      <>
        <input aria-label="name" />
        <EasterEgg />
      </>,
    );

    const input = screen.getByLabelText("name");
    for (const key of "ynwa") fireEvent.keyDown(input, { key });
    expect(screen.getByRole("status")).toHaveTextContent("");
  });
});
