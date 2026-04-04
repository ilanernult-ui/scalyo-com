import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "@/components/ErrorBoundary";

const Thrower = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error("test error");
  return <div>safe content</div>;
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    // Suppress React's error logging during tests
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <Thrower shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText("safe content")).toBeDefined();
  });

  it("shows error UI when child throws", () => {
    render(
      <ErrorBoundary>
        <Thrower shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText(/une erreur inattendue/i)).toBeDefined();
    expect(screen.getByText(/test error/i)).toBeDefined();
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>custom fallback</div>}>
        <Thrower shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("custom fallback")).toBeDefined();
  });

  it("shows a retry button when an error occurs", () => {
    render(
      <ErrorBoundary>
        <Thrower shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole("button", { name: /réessayer/i })).toBeDefined();
  });
});
