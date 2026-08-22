// Real-time Air Quality Index for a society's location.
// Proxies the free waqi.info (World Air Quality Index) API so the token
// stays server-side, with a 30-min in-memory cache (air quality is slow-moving).

const cache = new Map();
const TTL = 30 * 60 * 1000;

exports.getAqi = async (req, res, next) => {
  try {
    const key = 'gurgaon';
    const hit = cache.get(key);
    if (hit && Date.now() - hit.ts < TTL) return res.json(hit.data);

    const token = process.env.AQI_TOKEN;
    if (!token) return res.status(503).json({ error: 'AQI unavailable — set AQI_TOKEN in server/.env' });

    // The app is Gurgaon-only and waqi's geo: feed is gated; query the city
    // feed, which returns the nearest CPCB station reading for Gurgaon.
    const url = `https://api.waqi.info/feed/gurgaon/?token=${token}`;
    const r = await fetch(url);
    if (!r.ok) return res.status(502).json({ error: 'AQI provider HTTP error', status: r.status });
    const j = await r.json();
    if (!j || j.status !== 'ok' || !j.data || j.data.aqi == null) {
      return res.status(502).json({ error: 'AQI provider error', detail: j && j.data });
    }

    const iaqi = j.data.iaqi || {};
    const pollutants = {};
    for (const [k, v] of Object.entries(iaqi)) {
      pollutants[k.toUpperCase()] = v.v;
    }

    const payload = {
      aqi: j.data.aqi,
      city: (j.data.city && j.data.city.name) || null,
      time: (j.data.time && j.data.time.iso) || null,
      dominant: j.data.dominentpol || null,
      pollutants
    };
    cache.set(key, { data: payload, ts: Date.now() });
    return res.json(payload);
  } catch (e) {
    next(e);
  }
};
