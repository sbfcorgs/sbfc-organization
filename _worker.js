// Cloudflare Pages — Advanced Mode entry point (Direct Upload projects).
// Runs the SBFC API (index.js) for /api/* and serves the uploaded static
// files for everything else. Only needed when uploading this folder as a
// Direct Upload deployment; Git-connected Pages projects use functions/
// instead and should NOT contain this file at the root.
import worker from "./index.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/") || request.method === "OPTIONS") {
      return worker.fetch(request, env, ctx);
    }
    return env.ASSETS.fetch(request);
  },
};
