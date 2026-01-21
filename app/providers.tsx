"use client";

import DefaultLayout from "@/layouts/DefaultLayout";
import i18n from "@/i18n";
import { I18nextProvider } from "react-i18next";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <DefaultLayout>{children}</DefaultLayout>
    </I18nextProvider>
  );
}
