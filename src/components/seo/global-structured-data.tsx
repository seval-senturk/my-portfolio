import { JsonLd } from "@/seo/json-ld";
import { buildGlobalStructuredData } from "@/services/seo/seo-structured-data.service";

export async function GlobalStructuredData() {
  const structuredData = await buildGlobalStructuredData();
  return <JsonLd data={structuredData} />;
}
