// One place for analytics, so the provider can change without touching any component.
//
// Components call track(). By default it does nothing. A provider registers itself with
// setAnalyticsProvider(), for example Plausible, Umami or PostHog. Page views are separate:
// see components/web-analytics.tsx, which loads Cloudflare Web Analytics when configured.

export type AnalyticsEventData = Record<string, string | number | boolean | null>;
export type AnalyticsProvider = (event: string, data?: AnalyticsEventData) => void;

let provider: AnalyticsProvider | null = null;

export function setAnalyticsProvider(next: AnalyticsProvider | null): void {
  provider = next;
}

export function track(event: string, data?: AnalyticsEventData): void {
  try {
    provider?.(event, data);
  } catch {
    // Analytics must never break the page.
  }
}
