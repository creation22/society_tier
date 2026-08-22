import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadGoogleMaps, isMapsConfigured } from '../utils/loadGoogleMaps.js';
import { TIER_META, tierColor } from '../utils/tier.js';
import { formatCount, formatRating } from '../utils/format.js';
import { fetchAqi, aqiCategory } from '../utils/aqi.js';

const GURGAON_CENTER = { lat: 28.445, lng: 77.055 };
const GURGAON_BOUNDS = { north: 28.62, south: 28.15, west: 76.78, east: 77.16 };
const DEFAULT_ZOOM = 14;
const NAME_ZOOM = 14; // below this zoom pins go compact (no name pills)

const escXml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const escHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function mixHex(hex, other, t) {
  const a = parseInt(hex.slice(1), 16);
  const b = parseInt(other.slice(1), 16);
  const ch = (x, y) => Math.round(x + (y - x) * t);
  return `rgb(${ch((a >> 16) & 255, (b >> 16) & 255)},${ch((a >> 8) & 255, (b >> 8) & 255)},${ch(a & 255, b & 255)})`;
}

function headTextColor(hex) {
  const v = parseInt(hex.slice(1), 16);
  const lum = (0.299 * ((v >> 16) & 255) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255)) / 255;
  return lum > 0.65 ? '#0F172A' : '#FFFFFF';
}

let measureCtx = null;
function textWidth(text) {
  try {
    if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
    measureCtx.font = '700 11px "Space Grotesk", system-ui, sans-serif';
    return Math.ceil(measureCtx.measureText(text).width);
  } catch {
    return text.length * 6.4;
  }
}

const INK = '#0A0A0A';
const CREAM = '#F5F1E8';

/**
 * Brutalist map pin. Flat tier-colored teardrop with a thick black outline
 * and a hard offset shadow. Full mode stacks a cream name pill (black border,
 * tier dot, black text) above the pin. Compact mode (zoomed out) drops the
 * pill so labels never collide.
 */
const iconCache = new Map();
function pinIcon(maps, s, { selected = false, compact = false } = {}) {
  const key = `${s.slug}|${selected ? 1 : 0}|${compact ? 1 : 0}`;
  if (iconCache.has(key)) return iconCache.get(key);

  const color = tierColor(s.tier);
  const R = compact ? 10 : 12;
  const TAIL = 9;
  const SH = 3; // hard shadow offset

  function teardrop(cx, cy, tipY, fill, stroke, sw) {
    return (
      `<path d="M ${cx} ${tipY}` +
      ` C ${cx - R * 0.3} ${tipY - R * 0.55}, ${cx - R} ${cy + R * 0.45}, ${cx - R} ${cy}` +
      ` A ${R} ${R} 0 1 1 ${cx + R} ${cy}` +
      ` C ${cx + R} ${cy + R * 0.45}, ${cx + R * 0.3} ${tipY - R * 0.55}, ${cx} ${tipY} Z"` +
      ` fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`
    );
  }

  let pw, svgW, svgH, cx, cy, tipY, svg;

  if (compact) {
    pw = R * 2 + 6;
    svgW = pw + SH;
    cx = pw / 2;
    cy = R + 3;
    tipY = cy + R + TAIL;
    svgH = tipY + SH + 2;
    svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">` +
      `<g transform="translate(${SH},${SH})">` +
      teardrop(cx, cy, tipY, INK, 'none', 0) +
      `<circle cx="${cx}" cy="${cy}" r="7" fill="${INK}"/>` +
      `</g>` +
      teardrop(cx, cy, tipY, color, INK, 2.5) +
      `<circle cx="${cx}" cy="${cy}" r="7" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` +
      `<text x="${cx}" y="${cy + 3}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-weight="800" font-size="9" fill="${INK}">${formatRating(s.overallRating)}</text>` +
      `</svg>`;
  } else {
    const name = s.name.length > 26 ? `${s.name.slice(0, 25)}…` : s.name;
    const tw = textWidth(name);
    const DOT_R = 3;
    const DOT_GAP = 5;
    const PAD_X = 11;
    const innerW = DOT_R * 2 + DOT_GAP + tw;
    pw = Math.max(innerW + PAD_X * 2, 52);
    svgW = pw + SH;

    const PILL_H = 22;
    const GAP = 2;
    cx = pw / 2;
    cy = PILL_H + GAP + R;
    tipY = cy + R + TAIL;
    svgH = tipY + SH + 2;

    const pillW = innerW + PAD_X * 2;
    const pillX = (pw - pillW) / 2;
    const dotCx = pillX + PAD_X + DOT_R;
    const textCx = dotCx + DOT_R + DOT_GAP + tw / 2;
    const stemX = cx - 1.5;
    const stemH = cy - R - PILL_H + 4;

    svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">` +
      `<g transform="translate(${SH},${SH})">` +
      `<rect x="${pillX}" y="0" width="${pillW}" height="${PILL_H}" rx="4" fill="${INK}"/>` +
      `<rect x="${stemX}" y="${PILL_H - 2}" width="3" height="${stemH}" fill="${INK}"/>` +
      teardrop(cx, cy, tipY, INK, 'none', 0) +
      `<circle cx="${cx}" cy="${cy}" r="7.5" fill="${INK}"/>` +
      `</g>` +
      `<rect x="${stemX}" y="${PILL_H - 2}" width="3" height="${stemH}" fill="${INK}"/>` +
      teardrop(cx, cy, tipY, color, INK, 2.5) +
      `<circle cx="${cx}" cy="${cy}" r="7.5" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` +
      `<text x="${cx}" y="${cy + 3.2}" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-weight="800" font-size="9.5" fill="${INK}">${formatRating(s.overallRating)}</text>` +
      `<rect x="${pillX}" y="0" width="${pillW}" height="${PILL_H}" rx="4" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="${dotCx}" cy="${PILL_H / 2}" r="${DOT_R}" fill="${color}" stroke="${INK}" stroke-width="1.5"/>` +
      `<text x="${textCx}" y="15.2" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-weight="800" font-size="11" fill="${INK}">${escXml(name)}</text>` +
      `</svg>`;
  }

  const scale = selected ? 1.18 : 1;
  const icon = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new maps.Size(svgW * scale, svgH * scale),
    anchor: new maps.Point(cx * scale, tipY * scale)
  };
  iconCache.set(key, icon);
  return icon;
}

let iwCssDone = false;
function injectInfoWindowCss() {
  if (iwCssDone || document.getElementById('st-gmaps-css')) return;
  iwCssDone = true;
  const style = document.createElement('style');
  style.id = 'st-gmaps-css';
  style.textContent = `
    .gm-style .gm-style-iw-c{padding:0!important;background:transparent!important;box-shadow:none!important;border-radius:0!important}
    .gm-style .gm-style-iw-t::after{display:none!important}
    .gm-style .gm-style-iw-d{overflow:hidden!important}
    .gm-style .gm-ui-hover-effect{top:6px!important;right:6px!important;width:24px!important;height:24px!important;border:2px solid #0A0A0A!important;background:#fff!important;box-shadow:2px 2px 0 0 #0A0A0A!important;z-index:2}
    .st-iw{min-width:230px;max-width:264px;background:#fff;border:3px solid #0A0A0A;box-shadow:6px 6px 0 0 #0A0A0A;font-family:'Space Grotesk',system-ui,sans-serif}
    .st-iw-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:3px solid #0A0A0A}
    .st-iw-name{font-weight:800;font-size:13px;line-height:1.2;text-transform:uppercase}
    .st-iw-chip{flex-shrink:0;font-size:10px;font-weight:800;letter-spacing:.04em;padding:2px 7px;border:2px solid #0A0A0A;background:#fff;color:#0A0A0A}
    .st-iw-body{padding:12px}
    .st-iw-rating{font-size:22px;font-weight:800;color:#0A0A0A;line-height:1}
    .st-iw-rating small{font-size:13px;margin-left:2px}
    .st-iw-meta{margin-top:5px;font-size:11px;font-weight:700;text-transform:uppercase;color:#555}
    .st-iw-btn{display:block;text-align:center;margin-top:10px;padding:8px 10px;border:3px solid #0A0A0A;background:#0A0A0A;color:#fff;font-size:11px;font-weight:800;text-transform:uppercase;text-decoration:none;box-shadow:3px 3px 0 0 #6C2BD9;transition:transform .1s,box-shadow .1s}
    .st-iw-btn:hover{transform:translate(2px,2px);box-shadow:1px 1px 0 0 #6C2BD9}
  `;
  document.head.appendChild(style);
}

/**
 * Interactive Google Map locked to Gurugram: every society shown as a
 * name-labeled pin (no clustering), tier-colored, with a modern preview card.
 */
export default function MapView({ societies, onBoundsChange, selectedSlug, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoRef = useRef(null);
  const lastOpenedRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const navigate = useNavigate();
  const lastAnchorRef = useRef(null);
  const zoomRef = useRef(DEFAULT_ZOOM);
  const aqiTokenRef = useRef(0);

  function attachAqi(s) {
    const token = ++aqiTokenRef.current;
    fetchAqi()
      .then((d) => {
        if (token !== aqiTokenRef.current || !infoRef.current) return;
        const el = document.querySelector('.st-iw-aqi');
        if (!el) return;
        const cat = aqiCategory(d.aqi);
        el.innerHTML =
          `<span style="color:${cat.color}">●</span> ` +
          `<strong>Gurugram AQI ${d.aqi}</strong> <span style="color:#555">${cat.label}</span>`;
      })
      .catch(() => {});
  }

  useEffect(() => {
    if (!isMapsConfigured()) {
      setError('no-key');
      return undefined;
    }
    if (mapRef.current) return undefined;
    let cancelled = false;
    injectInfoWindowCss();
    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !containerRef.current) return;
        const map = new maps.Map(containerRef.current, {
          center: GURGAON_CENTER,
          zoom: DEFAULT_ZOOM,
          minZoom: 12,
          maxZoom: 18,
          restriction: { latLngBounds: GURGAON_BOUNDS, strictBounds: true },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: 'greedy',
          // Hide shops/business labels, keep landmarks, hospitals, parks, schools, transit.
          styles: [
            { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
            { featureType: 'poi.medical', stylers: [{ visibility: 'on' }] },
            { featureType: 'poi.government', stylers: [{ visibility: 'on' }] },
            { featureType: 'poi.park', stylers: [{ visibility: 'on' }] },
            { featureType: 'poi.school', stylers: [{ visibility: 'on' }] },
            { featureType: 'poi.attraction', stylers: [{ visibility: 'on' }] },
            { featureType: 'transit', stylers: [{ visibility: 'on' }] }
          ]
        });
        mapRef.current = map;
        map.addListener('idle', () => {
          zoomRef.current = map.getZoom();
          setZoom(zoomRef.current);
        });
        if (typeof ResizeObserver !== 'undefined') {
          new ResizeObserver(() => maps.event.trigger(map, 'resize')).observe(containerRef.current);
        }
        setReady(true);
      })
      .catch(() => setError('load-failed'));
    return () => {
      cancelled = true;
    };
  }, []);

  function openInfo(maps, s) {
    if (!infoRef.current) infoRef.current = new maps.InfoWindow({ maxWidth: 270 });
    const color = tierColor(s.tier);
    const txt = headTextColor(color);
    infoRef.current.setContent(
      `<div class="st-iw">` +
        `<div class="st-iw-head" style="background:${color};color:${txt}">` +
        `<span class="st-iw-name">${escHtml(s.name)}</span>` +
        `<span class="st-iw-chip">${escHtml(s.tier)} TIER</span>` +
        `</div>` +
        `<div class="st-iw-body">` +
        `<div class="st-iw-rating">${formatRating(s.overallRating)}<small>★</small></div>` +
        `<div class="st-iw-meta">${escHtml(s.sector)}, Gurgaon · ${formatCount(s.ratingCount)} ratings</div>` +
        `<div class="st-iw-aqi" style="margin-top:4px;font-size:11px;font-weight:700;text-transform:uppercase">loading Gurugram AQI…</div>` +
        `<a class="st-iw-btn" href="/society/${encodeURIComponent(s.slug)}">View details →</a>` +
        `</div></div>`
    );
    infoRef.current.open({ anchor: lastAnchorRef.current, map: mapRef.current });
    lastOpenedRef.current = s.slug;
    attachAqi(s);
  }

  // Sync named pins whenever societies change.
  useEffect(() => {
    if (!ready || !mapRef.current) return undefined;
    const maps = window.google.maps;

    if (infoRef.current) infoRef.current.close();
    lastOpenedRef.current = null;
    markersRef.current.forEach((m) => m.marker.setMap(null));

    markersRef.current = (societies || []).map((s) => {
      const marker = new maps.Marker({
        position: { lat: s.latitude, lng: s.longitude },
        map: mapRef.current,
        title: `${s.name} — ${formatRating(s.overallRating)}★ (${s.tier})`,
        icon: pinIcon(maps, s, { compact: false }),
        zIndex: 10
      });
      marker.addListener('click', () => {
        if (onSelect) onSelect(s.slug);
        else {
          lastAnchorRef.current = marker;
          openInfo(maps, s);
        }
      });
      return { slug: s.slug, marker, data: s, compact: false };
    });

    return undefined;
  }, [ready, societies]); // eslint-disable-line react-hooks/exhaustive-deps

  // Swap between full (named) and compact pins as zoom crosses the threshold.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const maps = window.google.maps;
    markersRef.current.forEach((m) => {
      const sel = m.slug === selectedSlug;
      const compact = false;
      if (m.compact !== compact || m.sel !== sel) {
        m.marker.setIcon(pinIcon(maps, m.data, { selected: sel, compact }));
        m.compact = compact;
        m.sel = sel;
      }
    });
  }, [zoom, selectedSlug, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // Highlight + focus the selected society.
  useEffect(() => {
    if (!ready || !selectedSlug) return;
    const maps = window.google.maps;
    const entry = markersRef.current.find((m) => m.slug === selectedSlug);
    if (!entry || !mapRef.current) return;

    markersRef.current.forEach((m) => {
      const sel = m.slug === selectedSlug;
      const compact = false;
      m.marker.setIcon(pinIcon(maps, m.data, { selected: sel, compact }));
      m.compact = compact;
      m.marker.setZIndex(sel ? 1000 : 10);
    });

    const repeat = lastOpenedRef.current === selectedSlug;
    mapRef.current.panTo(entry.marker.getPosition());
    if (!repeat) {
      entry.marker.setAnimation(maps.Animation.BOUNCE);
      setTimeout(() => entry.marker.setAnimation(null), 650);
    }
    lastAnchorRef.current = entry.marker;
    openInfo(maps, entry.data);
  }, [selectedSlug, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // Emit viewport bounds.
  useEffect(() => {
    if (!ready || !onBoundsChange || !mapRef.current) return undefined;
    const maps = window.google.maps;
    const emit = () => {
      const b = mapRef.current.getBounds();
      if (!b) return;
      onBoundsChange({
        north: b.getNorthEast().lat(),
        south: b.getSouthWest().lat(),
        east: b.getNorthEast().lng(),
        west: b.getSouthWest().lng()
      });
    };
    maps.event.addListenerOnce(mapRef.current, 'idle', emit);
    const listener = mapRef.current.addListener('idle', emit);
    return () => listener.remove();
  }, [ready, onBoundsChange]);

  const recenter = () => {
    if (!mapRef.current) return;
    mapRef.current.panTo(GURGAON_CENTER);
    mapRef.current.setZoom(DEFAULT_ZOOM);
  };

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center border-3 border-ink bg-cream p-8 text-center">
        <div className="mb-3 inline-block border-3 border-ink bg-tierS px-3 py-1 font-display shadow-brutal-sm">MAP OFFLINE</div>
        <p className="max-w-md font-bold uppercase text-gray-700">
          {error === 'no-key'
            ? 'Set VITE_GOOGLE_MAPS_API_KEY in client/.env to enable the live Gurgaon map.'
            : 'Google Maps failed to load. Check your API key and billing settings.'}
        </p>
        <div className="mt-4 grid w-full max-w-sm gap-2">
          {(societies || []).slice(0, 6).map((s) => (
            <button
              key={s.slug}
              onClick={() => navigate(`/society/${s.slug}`)}
              className="flex items-center justify-between border-3 border-ink bg-paper px-3 py-2 shadow-brutal-sm hover:bg-tierS"
            >
              <span className="font-bold">{s.name}</span>
              <span className="text-sm">{formatRating(s.overallRating)} ★ · {s.tier}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Dedicated div owned by Google Maps — React must never render children into it. */}
      <div className="h-full w-full border-3 border-ink" ref={containerRef} />

      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-cream">
          <span className="animate-pulse border-3 border-ink bg-tierS px-3 py-1 font-display">LOADING MAP…</span>
        </div>
      )}

      {ready && (
        <>
          {/* Tier legend */}
          <div className="absolute top-4 left-4 z-10 hidden flex-col gap-1.5 border-3 border-ink bg-cream p-3 shadow-brutal-sm sm:flex">
            {Object.entries(TIER_META).map(([tier, meta]) => (
              <div key={tier} className="flex items-center gap-2">
                <span className="h-3 w-3 shrink-0 border-2 border-ink" style={{ background: meta.color }} />
                <span className="text-[11px] font-bold uppercase tracking-wide text-ink">
                  {tier} · {meta.text}
                </span>
              </div>
            ))}
          </div>

          {/* Recenter */}
          <button
            aria-label="Recenter on Gurgaon"
            onClick={recenter}
            className="absolute bottom-6 right-4 z-10 flex h-11 w-11 items-center justify-center border-3 border-ink bg-tierS shadow-brutal-sm transition-all hover:shadow-brutal active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="6" />
              <line x1="12" y1="1.5" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22.5" />
              <line x1="1.5" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22.5" y2="12" />
              <circle cx="12" cy="12" r="1.8" fill="#0A0A0A" stroke="none" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
