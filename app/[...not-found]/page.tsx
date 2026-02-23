"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Construction, MoveLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-zinc-100 opacity-75"></div>
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white border border-zinc-100 shadow-sm">
          <Construction className="h-10 w-10 text-zinc-400" strokeWidth={1.5} />
        </div>
      </div>

      <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-5xl">
        Work in Progress
      </h1>

      <div className="max-w-md space-y-4">
        <p className="text-balance text-zinc-500 leading-relaxed">
          Chúng tôi đang biên soạn nội dung cho mục này. Những tựa sách và bộ
          sưu tập mới nhất sẽ sớm được cập nhật tại đây.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link href="/">
          <Button
            variant="outline"
            className="group h-12 px-8 rounded-none border-zinc-950 font-bold uppercase tracking-widest transition-all hover:bg-zinc-950 hover:text-white"
          >
            <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Trở về trang chủ
          </Button>
        </Link>

        <Link href="/books">
          <Button
            variant="ghost"
            className="group h-12 px-8 rounded-none font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-950"
          >
            Xem kho sách
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="absolute bottom-10 text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-300">
        TASCHEN © 2024 — Digital Catalog
      </div>
    </div>
  );
}