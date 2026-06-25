import { getActiveRedirectMap } from "@/services/admin/seo.admin.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const map = await getActiveRedirectMap();

  return Response.json(map, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
