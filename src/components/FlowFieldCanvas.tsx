"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT_DESKTOP = 1000;
const PARTICLE_COUNT_MOBILE = 500;
const NOISE_SCALE = 0.0015;
/** How fast the vector field drifts over time (lower = calmer, slower “river” shifts). */
const NOISE_SPEED = 0.00015;
const MOUSE_RADIUS = 100;
/** Scales ambient flow only (noise field); mouse uses separate tuning below. */
const MOTION_SCALE = 0.38;
/** Softens vortex strength vs spec `3.0` multiplier (lower = gentler cursor pull). */
const MOUSE_FORCE_SCALE = 0.14;
/** Per-frame lerp toward real cursor (lower = slower, gentler follow). */
const MOUSE_SMOOTH = 0.055;

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

const GRAD3: readonly [number, number, number][] = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1]
];

function createNoise2D(): (x: number, y: number) => number {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }

  return (xin: number, yin: number) => {
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1: number;
    let j1: number;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;

    const ii = i & 255;
    const jj = j & 255;

    let n0 = 0;
    let n1 = 0;
    let n2 = 0;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      const gi0 = permMod12[ii + perm[jj]];
      t0 *= t0;
      const g = GRAD3[gi0];
      n0 = t0 * t0 * (g[0] * x0 + g[1] * y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      const gi1 = permMod12[ii + i1 + perm[jj + j1]];
      t1 *= t1;
      const g = GRAD3[gi1];
      n1 = t1 * t1 * (g[0] * x1 + g[1] * y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      const gi2 = permMod12[ii + 1 + perm[jj + 1]];
      t2 *= t2;
      const g = GRAD3[gi2];
      n2 = t2 * t2 * (g[0] * x2 + g[1] * y2);
    }

    return 45 * (n0 + n1 + n2);
  };
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  speed: number;
  lifespan: number;
  age: number;
  r: number;
  g: number;
  b: number;
  baseA: number;
};

function lifeAlpha(age: number, lifespan: number): number {
  if (age < 30) return age / 30;
  if (age > lifespan - 30) return Math.max(0, (lifespan - age) / 30);
  return 1;
}

function spawnParticle(W: number, H: number, p: Particle): void {
  p.x = Math.random() * W;
  p.y = Math.random() * H;
  p.vx = 0;
  p.vy = 0;
  p.size = 0.4 + Math.random() * 1.1;
  p.speed = 0.3 + Math.random() * 0.7;
  p.lifespan = 200 + Math.floor(Math.random() * 301);
  p.age = 0;
  const roll = Math.random();
  if (roll < 0.7) {
    p.r = 214;
    p.g = 214;
    p.b = 214;
    p.baseA = 0.06 + Math.random() * 0.1;
  } else if (roll < 0.9) {
    p.r = 148;
    p.g = 168;
    p.b = 126;
    p.baseA = 0.12 + Math.random() * 0.14;
  } else {
    p.r = 155;
    p.g = 138;
    p.b = 122;
    p.baseA = 0.08 + Math.random() * 0.1;
  }
}

function initParticles(
  count: number,
  W: number,
  H: number
): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const p: Particle = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 1,
      speed: 1,
      lifespan: 300,
      age: 0,
      r: 214,
      g: 214,
      b: 214,
      baseA: 0.1
    };
    spawnParticle(W, H, p);
    out.push(p);
  }
  return out;
}

export default function FlowFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Raw pointer from events (target for smoothing). */
  const mouseTargetRef = useRef({ x: -9999, y: -9999 });
  /** Smoothed position used for forces (eases aggressive cursor motion). */
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const noise2 = createNoise2D();
    let W = 0;
    let H = 0;
    let particles: Particle[] = [];
    let frame = 0;

    function particleCount() {
      return window.innerWidth < 640
        ? PARTICLE_COUNT_MOBILE
        : PARTICLE_COUNT_DESKTOP;
    }

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
      particles = initParticles(particleCount(), W, H);
      frame = 0;
      c.fillStyle = "rgba(30, 29, 26, 1)";
      c.fillRect(0, 0, W, H);
    }

    function onMouseMove(e: MouseEvent) {
      mouseTargetRef.current.x = e.clientX;
      mouseTargetRef.current.y = e.clientY;
    }

    function onMouseLeave() {
      mouseTargetRef.current.x = -9999;
      mouseTargetRef.current.y = -9999;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    }

    function draw() {
      if (!canvas) return;

      c.fillStyle = "rgba(30, 29, 26, 0.06)";
      c.fillRect(0, 0, W, H);

      frame += 1;
      const time = frame;

      const tx = mouseTargetRef.current.x;
      const ty = mouseTargetRef.current.y;
      let sx = mouseRef.current.x;
      let sy = mouseRef.current.y;
      if (tx < -5000) {
        sx = -9999;
        sy = -9999;
      } else if (sx < -5000) {
        sx = tx;
        sy = ty;
      } else {
        sx += (tx - sx) * MOUSE_SMOOTH;
        sy += (ty - sy) * MOUSE_SMOOTH;
      }
      mouseRef.current.x = sx;
      mouseRef.current.y = sy;
      const mx = sx;
      const my = sy;

      c.lineCap = "round";

      for (const p of particles) {
        const px = p.x;
        const py = p.y;

        const angle =
          noise2(
            p.x * NOISE_SCALE,
            p.y * NOISE_SCALE + time * NOISE_SPEED
          ) *
          Math.PI *
          4;
        const curl =
          noise2(
            p.x * NOISE_SCALE + 100,
            p.y * NOISE_SCALE + 100 + time * NOISE_SPEED * 0.7
          ) * Math.PI * 2;

        const targetVx =
          Math.cos(angle + curl * 0.3) * p.speed * MOTION_SCALE;
        const targetVy =
          Math.sin(angle + curl * 0.3) * p.speed * MOTION_SCALE;

        p.vx += (targetVx - p.vx) * 0.06;
        p.vy += (targetVy - p.vy) * 0.06;

        const mdx = p.x - mx;
        const mdy = p.y - my;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_RADIUS && mDist > 1e-6) {
          const force =
            (1 - mDist / MOUSE_RADIUS) * 3.0 * MOUSE_FORCE_SCALE;
          const ax =
            (-mdy / mDist) * force * 1.2 + (mdx / mDist) * force * -0.25;
          const ay =
            (mdx / mDist) * force * 1.2 + (mdy / mDist) * force * -0.25;
          p.vx += ax;
          p.vy += ay;
        }

        p.x += p.vx;
        p.y += p.vy;

        const la = lifeAlpha(p.age, p.lifespan);
        const alpha = p.baseA * la;
        c.strokeStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
        c.lineWidth = p.size;
        c.beginPath();
        c.moveTo(px, py);
        c.lineTo(p.x, p.y);
        c.stroke();

        p.age += 1;
        if (
          p.age >= p.lifespan ||
          p.x < -20 ||
          p.x > W + 20 ||
          p.y < -20 ||
          p.y > H + 20
        ) {
          spawnParticle(W, H, p);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    const onResize = () => {
      resize();
    };
    window.addEventListener("resize", onResize);
    resize();

    if (reducedMotion) {
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="cosmos"
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
