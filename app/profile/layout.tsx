'use client'
import { Footer } from "@/app/profile/_components/Footer";
import Header from "@/app/profile/_components/Header";
import { selectorCurrentUser, useAuthStore } from "@/features/auth";
import { useRouter } from "next/navigation";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = useAuthStore(selectorCurrentUser);
  const router = useRouter();
  React.useEffect(() => {
    if (!currentUser) router.replace("/login");
  }, [currentUser, router]);

  if (!currentUser) return null;
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
