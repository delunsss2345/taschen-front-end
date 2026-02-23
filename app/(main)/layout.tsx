"use client";

import Footer from "@/app/(main)/_components/Footer";
import Header from "@/app/(main)/_components/Header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>

      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
