import Script from "next/script";

/**
 * GA4 tracking via next/script. Reads GA_MEASUREMENT_ID and no-ops
 * entirely when it is unset, so the site works before the client provides an ID.
 * TODO: client to provide — set GA_MEASUREMENT_ID before launch.
 */
export function Analytics() {
  const id = process.env.GA_MEASUREMENT_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
