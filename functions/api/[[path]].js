// Cloudflare Pages Function — runs the SBFC Worker (index.js) on /api/*
// on the Pages domain itself, so the public site and admin panel can call
// same-origin /api/* with no CORS or routing setup.
//
// Deploys automatically: push this repo and Pages builds it. The only
// manual step is binding the D1 database as `DB` in the Pages project
// (Settings → Functions → D1 database bindings) and applying schema.sql.
import worker from "../../index.js";

export async function onRequest(context) {
  return worker.fetch(context.request, context.env, context);
}
