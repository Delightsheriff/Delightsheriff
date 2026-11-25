import Script from "next/script";

// Cloudflare Web Analytics: free, cookie-free page views and Core Web Vitals. It is only added
// when a token is configured, so nothing loads in development or on a host that does not use it.
// It counts page views only. For click events, register a provider in lib/analytics.ts.
export function WebAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  if (!token) return null;

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
      strategy="afterInteractive"
    />
  );
}
