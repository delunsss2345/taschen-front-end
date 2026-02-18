"use client";

import i18n from "@/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <I18nextProvider i18n={i18n}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster position="bottom-center" />
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </I18nextProvider>
  );
}
