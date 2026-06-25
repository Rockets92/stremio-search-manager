// Stremio "Ricerca Riordinata" - backend per Cloudflare Pages Functions
//
// Rotte gestite:
//   GET /api/manifest?url=<manifestUrl>          -> proxy (per la UI, aggira il CORS)
//   GET /<config>/manifest.json                  -> manifest dell'addon, cataloghi nell'ordine scelto
//   GET /<config>/catalog/<type>/<id>/<extra>.json -> inoltra la ricerca alla fonte originale
//
// <config> e' un blob JSON codificato in base64url che contiene l'elenco ordinato
// delle righe (cataloghi) e, per ognuna, a quale addon/catalogo originale puntare.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "max-age=0, no-cache",
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });
}

function b64urlDecode(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function baseOf(manifestUrl) {
  // toglie "/manifest.json" (ed eventuali code) lasciando il resto del path
  return manifestUrl.replace(/\/manifest\.json.*$/i, "");
}

export async function onRequest(context) {
  const { request } = context;
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

  const url = new URL(request.url);
  const segments = url.pathname.replace(/^\/+/, "").split("/");

  // --- helper per la UI: scarica un manifest aggirando il CORS ---
  if (segments[0] === "api" && segments[1] === "manifest") {
    const target = url.searchParams.get("url");
    if (!target) return json({ error: "Manca il parametro url" }, 400);
    try {
      const r = await fetch(target, { headers: { accept: "application/json" } });
      const data = await r.json();
      return json(data);
    } catch (e) {
      return json({ error: "Impossibile leggere il manifest: " + e.message }, 502);
    }
  }

  // --- rotte dell'addon ---
  let cfg;
  try {
    cfg = JSON.parse(b64urlDecode(segments[0]));
    if (!cfg || !Array.isArray(cfg.catalogs)) throw new Error("struttura non valida");
  } catch (e) {
    return json({ error: "Configurazione non valida nell'URL" }, 400);
  }

  const resource = segments[1];

  // MANIFEST
  if (resource === "manifest.json") {
    const types = [...new Set(cfg.catalogs.map((c) => c.type))];
    const manifest = {
      id: "com.cloudflare.ricerca-riordinata." + (cfg.id || "default"),
      version: "1.0.0",
      name: cfg.name || "Ricerca Riordinata",
      description:
        "Mostra le righe della ricerca nell'ordine che hai scelto, prendendo i risultati dalle fonti originali.",
      logo: "https://icons.veryicon.com/png/o/object/material-design-icons-1/sort-2.png",
      resources: ["catalog"],
      types,
      idPrefixes: [],
      catalogs: cfg.catalogs.map((c) => ({
        type: c.type,
        id: c.uid,
        name: c.name,
        // isRequired:true -> il catalogo NON appare nella Home/Discover, solo nella ricerca
        extra: [{ name: "search", isRequired: true }],
      })),
      behaviorHints: { configurable: true, configurationRequired: false },
    };
    return json(manifest);
  }

  // CATALOG (ricerca)
  if (resource === "catalog") {
    const type = segments[2];
    let id = segments[3] || "";
    let extra = segments[4]; // presente se c'e' un termine di ricerca

    let extraStr = "";
    if (extra === undefined) {
      id = id.replace(/\.json$/i, "");
    } else {
      extraStr = extra.replace(/\.json$/i, "");
    }

    const entry = cfg.catalogs.find((c) => c.uid === id && c.type === type);
    if (!entry) return json({ metas: [] });

    // ricostruisce l'URL del catalogo originale, inoltrando il termine di ricerca cosi' com'e'
    let upstream = baseOf(entry.src) + "/catalog/" + entry.utype + "/" + entry.uid_up;
    if (extraStr) upstream += "/" + extraStr;
    upstream += ".json";

    try {
      const r = await fetch(upstream, { headers: { accept: "application/json" } });
      if (!r.ok) return json({ metas: [] });
      const data = await r.json();
      return json({ metas: Array.isArray(data.metas) ? data.metas : [] });
    } catch (e) {
      return json({ metas: [] });
    }
  }

  return json({ error: "Risorsa non trovata" }, 404);
}
