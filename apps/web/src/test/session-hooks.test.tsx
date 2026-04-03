import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useLogoutMutation } from "@/hooks/use-session";
import { apiClient } from "@/lib/api";
import { latestApiKeySecretStorageKey } from "@/lib/routes";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

afterEach(() => {
  vi.restoreAllMocks();
  window.sessionStorage.clear();
});

describe("useLogoutMutation", () => {
  it("clears the persisted api key secret after logout succeeds", async () => {
    vi.spyOn(apiClient, "logout").mockResolvedValue(undefined);
    window.sessionStorage.setItem(
      latestApiKeySecretStorageKey,
      JSON.stringify({
        userId: "usr_demo_admin",
        secret: "cfm_full_secret_returned_once",
      }),
    );

    const { result } = renderHook(() => useLogoutMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(
      window.sessionStorage.getItem(latestApiKeySecretStorageKey),
    ).toBeNull();
  });
});
