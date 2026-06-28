import sanitizeHtml from "sanitize-html";

const BLOG_ALLOWED_TAGS = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "strong",
  "em",
  "u",
  "s",
  "code",
  "pre",
  "blockquote",
  "hr",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "br",
  "span",
  "div",
] as const;

const BLOG_ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "title", "rel", "target"],
  img: ["src", "alt", "title", "width", "height", "class", "loading"],
  code: ["class"],
  pre: ["class"],
  span: ["class", "data-type"],
  div: ["class", "data-type"],
  th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
};

const BLOG_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...BLOG_ALLOWED_TAGS],
  allowedAttributes: BLOG_ALLOWED_ATTRIBUTES,
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
  disallowedTagsMode: "discard",
  transformTags: {
    a: (_tagName, attribs) => {
      const nextAttribs: Record<string, string> = { ...attribs, rel: "noopener noreferrer" };
      if (attribs.target === "_blank") {
        nextAttribs.target = "_blank";
      } else {
        delete nextAttribs.target;
      }
      return { tagName: "a", attribs: nextAttribs };
    },
  },
};

/** Strip dangerous markup from blog HTML while preserving TipTap output structure. */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html.trim(), BLOG_SANITIZE_OPTIONS);
}

/** Returns true when sanitized HTML contains visible text content. */
export function hasBlogTextContent(html: string): boolean {
  const plain = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 0;
}
