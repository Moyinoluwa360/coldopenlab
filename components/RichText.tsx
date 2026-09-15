import DOMPurify from "isomorphic-dompurify";

/**
 * Renders admin-authored rich-text HTML (from the Tiptap editor) after
 * sanitizing it, so stored markup can never inject scripts.
 */
export function RichText({ html, className }: { html: string; className?: string }) {
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
