import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { api } from "@/lib/api/fetchHandler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");

    if (!token || !userId) {
      return NextResponse.json(
        { success: false, message: "Link xác minh không hợp lệ" },
        { status: 400 }
      );
    }

    await api.get<unknown>(
      `auth/verify?token=${encodeURIComponent(token)}&userId=${encodeURIComponent(userId)}`,
    );

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    let message = "Đã xảy ra lỗi khi xác minh. Vui lòng thử lại.";

    if (
      error &&
      typeof error === "object" &&
      "message" in error
    ) {
      const e = error as { message?: string };
      if (e.message) {
        message = e.message;
      }
    }

    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}
