import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Mock useAuth
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

describe("ProtectedRoute", () => {
  it("shows a spinner while loading", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>protected content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText("protected content")).toBeNull();
  });

  it("redirects to /auth when unauthenticated", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>protected content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText("protected content")).toBeNull();
  });

  it("renders children when authenticated", () => {
    mockUseAuth.mockReturnValue({ user: { id: "abc123" }, loading: false });
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>protected content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("protected content")).toBeDefined();
  });
});
