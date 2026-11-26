// Cloudflare-only entry point. It serves the Studio, then hands everything else to Next.js.
//
// The Studio is a single-page app in public/studio. Its files are served as static assets, but a
// page address such as /studio/structure has no file, so it needs the Studio's index page.
// A Next.js rewrite to a public file does not work here, which is why this is done first.
import app from "./.open-next/worker.js";

export { DOQueueHandler } from "./.open-next/worker.js";

const worker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const isStudioPage =
      url.pathname.startsWith("/studio/") &&
      !url.pathname.startsWith("/studio/static/") &&
      (request.method === "GET" || request.method === "HEAD");

    if (isStudioPage) return env.ASSETS.fetch(new Request(new URL("/studio/", url), request));

    return app.fetch(request, env, ctx);
  },
};

export default worker;
