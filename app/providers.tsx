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
        <Toaster
          position="top-center"
          theme="light"
          expand
          toastOptions={{
            classNames: {
              success: '!bg-green-50 !border-green-200 !text-green-800',
              error: '!bg-red-50 !border-red-200 !text-red-800',
              loading: '!bg-blue-50 !border-blue-200 !text-blue-800',
            },
            style: {
              background: '#fff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              padding: '14px 16px',
              fontSize: '14px',
              minHeight: '56px',
            },
          }}
        />
        <ReduxProvider store={store}>
          {children}
        </ReduxProvider>
      </SessionProvider>
    </I18nextProvider>
  );
}
