"use client";

import { ProfileHeader } from "./_components/ProfileHeader";
import { ProfileSidebar } from "./_components/ProfileSidebar";
import ProtectedRoute from "../_components/ProtectedRoute";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <ProfileHeader />
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex gap-8">
            <ProfileSidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
