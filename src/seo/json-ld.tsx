import type { StructuredDataSchema } from "@/types/seo";

interface JsonLdProps {
  data: StructuredDataSchema | readonly StructuredDataSchema[];
}

export function JsonLd({ data }: JsonLdProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
