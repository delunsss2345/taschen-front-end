import { getAuthorizationHeader, handleRouteError } from "@/app/api/_utils/route-utils";
import { api } from "@/lib/api/fetchHandler";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers = getAuthorizationHeader(request);
    await api.delete(`notifications/${id}`, undefined, { headers });
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error, "Không thể xóa thông báo", "Delete Notification API Error");
  }
}
