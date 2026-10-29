import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { COUNTRY_COORDS } from "../../lib/countryCoords";
import { prefersReducedMotion } from "../../lib/useTweenedValues";

const LIT = [1, 0.69, 0.18];
const DIM = [0.55, 0.52, 0.85];
const SPOT = [0.18, 0.83, 0.75];
const PICK_RADIUS = (14 * Math.PI) / 180;
const CLICK_SLOP = 5;
const TAU = Math.PI * 2;

/** cobe orientation (phi, theta) that faces a [lat, lon] point toward the camera. */
function anglesFor([lat, lon]) {
  return [Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
}

/** Shortest signed distance between two angles on the circle. */
function angleDelta(from, to) {
  return ((((to - from) % TAU) + TAU + Math.PI) % TAU) - Math.PI;
}

/**
 * Inverse of cobe's orthographic projection: canvas point (px, py in CSS pixels, canvas `size`)
 * to [lat, lon] on the visible face, or null outside the disc (cobe draws it at 0.8 of half-size).
 */
function unproject(px, py, size, phi, theta) {
  const c = ((px / size) * 2 - 1) / 0.8;
  const s = -((py / size) * 2 - 1) / 0.8;
  const rest = 1 - c * c - s * s;
  if (rest < 0) return null;
  const d = Math.sqrt(rest);
  const [cosP, sinP, cosT, sinT] = [Math.cos(phi), Math.sin(phi), Math.cos(theta), Math.sin(theta)];
  const x = cosP * c + sinP * sinT * s - sinP * cosT * d;
  const y = cosT * s + sinT * d;
  const z = sinP * c - cosP * sinT * s + cosP * cosT * d;
  const lon = ((Math.atan2(z, -x) + Math.PI) * 180) / Math.PI;
  return [(Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI, ((lon + 540) % 360) - 180];
}

/** Great-circle angle between two [lat, lon] points, in radians. */
function angularDistance([lat1, lon1], [lat2, lon2]) {
  const r = Math.PI / 180;
  const cos =
    Math.sin(lat1 * r) * Math.sin(lat2 * r) +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.cos((lon1 - lon2) * r);
  return Math.acos(Math.max(-1, Math.min(1, cos)));
}

/**
 * Dotted WebGL globe. `countries` = [{ name, loss, selected }]; marker size follows sqrt(loss).
 * `focus` = { name, nonce } eases the globe to that country (nonce re-triggers the same one).
 * `onPick(name | null)` fires on a click (not a drag): nearest country within PICK_RADIUS, else null.
 */
export default function Globe({ countries, focus, onPick, onUnavailable }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const globeRef = useRef(null);
  const stateRef = useRef({ phi: 3.9, theta: 0.28, vel: 0, dragging: false, target: null });
  const markersRef = useRef([]);
  const tipRef = useRef(null);
  const [size, setSize] = useState(0);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setSize(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setSize(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const maxLoss = Math.max(...countries.map((c) => c.loss), 1);
  markersRef.current = countries
    .filter((c) => COUNTRY_COORDS[c.name])
    .map((c) => {
      const base = 0.028 + 0.075 * Math.sqrt(c.loss / maxLoss);
      if (c.spotlight) return { location: COUNTRY_COORDS[c.name], size: base * 1.5, color: SPOT };
      return {
        location: COUNTRY_COORDS[c.name],
        size: c.selected ? base : base * 0.6,
        color: c.selected ? LIT : DIM,
      };
    });

  useEffect(() => {
    globeRef.current?.update({ markers: markersRef.current });
  });

  useEffect(() => {
    if (!focus) return;
    const coords = COUNTRY_COORDS[focus.name];
    if (coords) stateRef.current.target = anglesFor(coords);
  }, [focus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = Math.round(size * dpr);
    canvas.width = px;
    canvas.height = px;

    let globe;
    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: px,
        height: px,
        phi: stateRef.current.phi,
        theta: stateRef.current.theta,
        dark: 1,
        diffuse: 1.4,
        mapSamples: 12000,
        mapBrightness: 5,
        baseColor: [0.1, 0.3, 0.34],
        markerColor: LIT,
        glowColor: [0.22, 0.16, 0.45],
        markers: markersRef.current,
      });
    } catch {
      onUnavailable?.();
      return;
    }
    globeRef.current = globe;

    const reduced = prefersReducedMotion();
    const s = stateRef.current;
    let visible = true;
    let frame = 0;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    function tick() {
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;

      if (s.target) {
        const dPhi = angleDelta(s.phi, s.target[0]);
        const dTheta = s.target[1] - s.theta;
        s.phi += dPhi * (reduced ? 1 : 0.08);
        s.theta += dTheta * (reduced ? 1 : 0.08);
        s.vel = 0;
        if (Math.abs(dPhi) < 0.002 && Math.abs(dTheta) < 0.002) s.target = null;
      } else if (!s.dragging) {
        s.phi += s.vel + (reduced ? 0 : 0.0016);
        s.vel *= 0.94;
      }
      s.theta = Math.max(-0.9, Math.min(0.9, s.theta));
      globe.update({ phi: s.phi, theta: s.theta });
    }
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      globe.destroy();
      globeRef.current = null;
    };
  }, [size, onUnavailable]);

  function onPointerDown(e) {
    const s = stateRef.current;
    s.dragging = true;
    s.target = null;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.downX = e.clientX;
    s.downY = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  /** Nearest country (within PICK_RADIUS) under a pointer event, or null. */
  function pickAt(e) {
    if (!size) return null;
    const s = stateRef.current;
    const box = e.currentTarget.getBoundingClientRect();
    const hit = unproject(e.clientX - box.left, e.clientY - box.top, size, s.phi, s.theta);
    if (!hit) return null;
    let best = null;
    let bestAngle = PICK_RADIUS;
    for (const c of countries) {
      const coords = COUNTRY_COORDS[c.name];
      if (!coords) continue;
      const angle = angularDistance(hit, coords);
      if (angle < bestAngle) {
        best = c.name;
        bestAngle = angle;
      }
    }
    return best;
  }

  function hoverAt(e) {
    const name = pickAt(e);
    if (name && tipRef.current) {
      const box = e.currentTarget.getBoundingClientRect();
      tipRef.current.style.transform = `translate(${e.clientX - box.left + 14}px, ${e.clientY - box.top + 14}px)`;
    }
    setHover(name);
  }

  function onPointerMove(e) {
    const s = stateRef.current;
    if (!s.dragging) {
      hoverAt(e);
      return;
    }
    const dx = (e.clientX - s.lastX) / (size || 1);
    const dy = (e.clientY - s.lastY) / (size || 1);
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.vel = dx * 2.4;
    s.phi += dx * 2.4;
    s.theta += dy * 1.6;
  }

  function endDrag() {
    stateRef.current.dragging = false;
  }

  function onPointerUp(e) {
    const s = stateRef.current;
    const wasDragging = s.dragging;
    endDrag();
    if (!wasDragging || !onPick || !size) return;
    if (Math.hypot(e.clientX - s.downX, e.clientY - s.downY) > CLICK_SLOP) return;
    onPick(pickAt(e));
  }

  return (
    <div className="globe" ref={wrapRef}>
      <div className="globe-glow" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        style={{ width: size, height: size, cursor: hover ? "pointer" : undefined }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => setHover(null)}
        onPointerCancel={endDrag}
        role="img"
        aria-label="Globe with one marker per headquarters country, sized by total loss"
      />
      <div className="globe-tip" ref={tipRef} hidden={!hover}>
        {hover}
      </div>
    </div>
  );
}
