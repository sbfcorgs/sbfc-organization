/**
 * Cloudflare Worker for SBFC Organization
 * Worker Name: sbfc-organization
 * Route Handlers: /api/dashboard, /api/stats, /api/donations, /api/savings
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/json; charset=utf-8"
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    // Handle /api/dashboard or /api/stats
    if (path === "/api/dashboard" || path === "/api/stats" || path === "/dashboard") {
      const responseData = {
        ok: true,
        message: "SBFC Organization Dashboard Stats",
        timestamp: new Date().toISOString(),
        savings: {
          memberCount: 248,
          totalMembers: 248,
          activeMembers: 248,
          totalSavingsBDT: 1540000
        },
        donations: [
          { id: "DON-001", status: "approved" },
          { id: "DON-002", status: "approved" }
        ],
        donationStats: {
          total: 5000,
          approved: 4850,
          pending: 150
        }
      };

      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: CORS_HEADERS
      });
    }

    // Handle /api/donations
    if (path === "/api/donations") {
      const donationsData = {
        ok: true,
        totalDonations: 5000,
        approvedDonations: 4850,
        recent: [
          { id: 1, donor: "Anonymous", amount: 1000, currency: "BDT", date: new Date().toISOString() },
          { id: 2, donor: "Wellwisher", amount: 5000, currency: "BDT", date: new Date().toISOString() }
        ]
      };

      return new Response(JSON.stringify(donationsData), {
        status: 200,
        headers: CORS_HEADERS
      });
    }

    // Handle /api/savings
    if (path === "/api/savings") {
      const savingsData = {
        ok: true,
        memberCount: 248,
        activeMembers: 248
      };

      return new Response(JSON.stringify(savingsData), {
        status: 200,
        headers: CORS_HEADERS
      });
    }

    // Health check / Default Root
    if (path === "/" || path === "/api") {
      return new Response(JSON.stringify({
        ok: true,
        service: "SBFC Organization API Service",
        status: "operational",
        version: "1.0.0",
        endpoints: [
          "/api/dashboard",
          "/api/stats",
          "/api/donations",
          "/api/savings"
        ]
      }), {
        status: 200,
        headers: CORS_HEADERS
      });
    }

    // 404 Fallback for unknown API routes
    return new Response(JSON.stringify({
      ok: false,
      error: "Endpoint Not Found",
      requestedPath: path
    }), {
      status: 404,
      headers: CORS_HEADERS
    });
  }
};
