import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]);

/**
 * Renders admin-authored rich-text HTML (from WordPress) after sanitizing it,
 * so stored markup can never inject scripts.
 */
export function RichText({ html, className }: { html: string; className?: string }) {
  const clean = sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class"],
      a: ["href", "name", "target", "rel", "data-type", "data-id"],
      img: ["src", "alt", "width", "height"],
    },
  });
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
