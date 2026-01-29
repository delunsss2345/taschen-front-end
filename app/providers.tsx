"use client";

import i18n from "@/i18n";
import { store } from "@/store";
import { SessionProvider } from "next-auth/react";
import { I18nextProvider } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "sonner";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
       <SessionProvider>
        <Toaster position="bottom-center" />
        <ReduxProvider store={store}>
      {children}
        </ReduxProvider>
      </SessionProvider>
    </I18nextProvider>
  );
}
