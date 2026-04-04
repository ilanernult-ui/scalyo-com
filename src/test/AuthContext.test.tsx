import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signOut: vi.fn().mockResolvedValue({}),
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
    }),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
    }),
    removeChannel: vi.fn(),
  },
}));

const Consumer = () => {
  const { user, loading, plan } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.id : "null"}</span>
      <span data-testid="plan">{plan}</span>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children without crashing", async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
    });
    expect(screen.getByTestId("plan").textContent).toBe("datadiag");
  });

  it("exposes loading=false after session resolves", async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
  });

  it("exposes user=null when unauthenticated", async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("null");
    });
  });

  it("defaults plan to datadiag", async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("plan").textContent).toBe("datadiag");
    });
  });
});
