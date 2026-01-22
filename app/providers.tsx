"use client";

import i18n from "@/i18n";
import DefaultLayout from "@/layouts/DefaultLayout";
import { SessionProvider } from "next-auth/react";
import { I18nextProvider } from "react-i18next";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
       <SessionProvider>
      {children}
      </SessionProvider>
    </I18nextProvider>
  );
}
