"use client";

/**
 * Web subset of the Memento3D brain mesh pipeline (see home-screen-spec + GLB replication brief):
 * GLB first mesh → center/scale holder → `WireframeGeometry` (triangle edges, matches GLB topology) →
 * markers on triangle centroids with spread + density-scaled radius → graph edges → auto yaw.
 * Gestures / hit surface / pinch are omitted on the marketing site.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/** Marketing: faster than app default (`0.03` rad/s) for clearer motion in the mockup */
const ROTATION_SPEED = 0.1;

/** Spec: `desiredWorldRadius` before density scaling */
const BASE_MARKER_WORLD_RADIUS = 0.022;

const GLB_URL = "/Rotten_Brain.glb";

/** Faint white–gray wireframe (screenshot: thin, skeletal, ethereal) */
const LINE_GRAY = new THREE.Color(0xd6d6d6);

const CLUSTER_HEX = [
  "#7A5EB8",
  "#C9953A",
  "#4A9088",
  "#5E7AA3",
  "#A86D78",
  "#6A8F72",
] as const;

const RANDOM_MARKER_HEX = [
  "#C4C4D4",
  "#5EB8CC",
  "#9B7FD4",
  "#D4A534",
  "#C75C72",
] as const;

useGLTF.preload(GLB_URL);

/**
 * Match iOS GLBGeometryLoader: **first mesh / first primitive** only.
 * `mergeGeometries` rewrites buffers and can break index↔position correspondence; this GLB has one mesh (`brain.1`).
 */
function cloneFirstMeshWorldGeometry(scene: THREE.Object3D): THREE.BufferGeometry | null {
  scene.updateMatrixWorld(true);
  let found: THREE.Mesh | undefined;
  scene.traverse((child) => {
    if (!found && child instanceof THREE.Mesh && child.geometry) {
      found = child;
    }
  });
  if (!found) return null;
  const g = found.geometry.clone();
  g.applyMatrix4(found.matrixWorld);
  return g;
}

function triangleCount(geometry: THREE.BufferGeometry): number {
  const pos = geometry.getAttribute("position");
  if (!pos) return 0;
  if (geometry.index) return geometry.index.count / 3;
  return pos.count / 3;
}

/** Centroid of triangle `triIndex` in current geometry space (post-centering). */
function getTriangleCentroid(
  geometry: THREE.BufferGeometry,
  triIndex: number
): THREE.Vector3 {
  const pos = geometry.getAttribute("position")!;
  const v0 = new THREE.Vector3();
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  if (geometry.index) {
    const idx = geometry.index;
    const f = triIndex * 3;
    const i0 = idx.getX(f);
    const i1 = idx.getX(f + 1);
    const i2 = idx.getX(f + 2);
    v0.set(pos.getX(i0), pos.getY(i0), pos.getZ(i0));
    v1.set(pos.getX(i1), pos.getY(i1), pos.getZ(i1));
    v2.set(pos.getX(i2), pos.getY(i2), pos.getZ(i2));
  } else {
    const f = triIndex * 3;
    v0.set(pos.getX(f), pos.getY(f), pos.getZ(f));
    v1.set(pos.getX(f + 1), pos.getY(f + 1), pos.getZ(f + 1));
    v2.set(pos.getX(f + 2), pos.getY(f + 2), pos.getZ(f + 2));
  }
  return new THREE.Vector3().addVectors(v0, v1).add(v2).multiplyScalar(1 / 3);
}

/**
 * Spread marker indices across triangle centroids: `step = max(1, floor(n / count))`,
 * index `(i * step) % n` — matches iOS placement pattern.
 */
function pickMarkerCentroidPositions(
  geometry: THREE.BufferGeometry,
  markerCount: number
): THREE.Vector3[] {
  const nTri = triangleCount(geometry);
  if (nTri === 0) return [];
  const count = Math.min(markerCount, nTri);
  const step = Math.max(1, Math.floor(nTri / count));
  const out: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const triIdx = (i * step) % nTri;
    out.push(getTriangleCentroid(geometry, triIdx));
  }
  return out;
}

function buildEdgeGeometry(
  points: THREE.Vector3[],
  hexColors: string[],
  maxEdges: number
): THREE.BufferGeometry {
  const nodeColors = hexColors.map((h) => new THREE.Color(h));
  const n = points.length;
  const pairs: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = points[i]!.distanceTo(points[j]!);
      if (d < 0.48 && d > 0.06) {
        pairs.push([i, j, d]);
      }
    }
  }
  pairs.sort((a, b) => a[2] - b[2]);
  const chosen = pairs.slice(0, maxEdges).map(([i, j]) => [i, j] as [number, number]);

  const positions: number[] = [];
  const colors: number[] = [];

  chosen.forEach(([i, j]) => {
    const a = points[i]!;
    const b = points[j]!;
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    const ca = nodeColors[i] ?? new THREE.Color(0xffffff);
    const cb = nodeColors[j] ?? new THREE.Color(0xffffff);
    colors.push(ca.r, ca.g, ca.b, cb.r, cb.g, cb.b);
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geo;
}

function BrainGltfWireframe({
  wireGeometry,
  scale,
}: {
  wireGeometry: THREE.BufferGeometry;
  scale: number;
}) {
  return (
    <group scale={[scale, scale, scale]}>
      <lineSegments geometry={wireGeometry}>
        <lineBasicMaterial
          color={LINE_GRAY}
          transparent
          opacity={0.34}
          depthWrite={false}
          depthTest
        />
      </lineSegments>
    </group>
  );
}

function PulsingMarkers({
  positions,
  hexColors,
  scale,
  markerRadii,
}: {
  positions: THREE.Vector3[];
  hexColors: string[];
  scale: number;
  markerRadii: number[];
}) {
  const materialsRef = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    materialsRef.current.forEach((m, i) => {
      if (!m) return;
      const phase = t * Math.PI + i * 0.65;
      m.emissiveIntensity = 1.8 + 0.8 * Math.sin(phase);
    });
  });

  return (
    <group scale={[scale, scale, scale]}>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[markerRadii[i] ?? 0.04, 24, 24]} />
          <meshStandardMaterial
            ref={(el) => {
              materialsRef.current[i] = el;
            }}
            color={hexColors[i]}
            emissive={hexColors[i]}
            emissiveIntensity={2.0}
            metalness={0.20}
            roughness={0.45}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function GraphEdges({
  geometry,
  scale,
}: {
  geometry: THREE.BufferGeometry;
  scale: number;
}) {
  return (
    <group scale={[scale, scale, scale]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.52}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

function GltfBrainScene() {
  const gltf = useGLTF(GLB_URL);
  const groupRef = useRef<THREE.Group>(null);

  const brain = useMemo(() => {
    const merged = cloneFirstMeshWorldGeometry(gltf.scene);
    if (!merged) {
      return null;
    }
    merged.computeBoundingBox();
    const box = merged.boundingBox;
    if (!box) {
      merged.dispose();
      return null;
    }
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0.0001 ? 2.2 / maxDim : 1;
    merged.translate(-center.x, -center.y, -center.z);

    const markerCount = 20;
    const markerPositions = pickMarkerCentroidPositions(merged, markerCount);
    const densityScale =
      markerCount <= 15 ? 1 : Math.min(1, Math.sqrt(15 / markerCount));
    const baseR = BASE_MARKER_WORLD_RADIUS * densityScale;
    const markerRadii = markerPositions.map(
      (_, i) => baseR * (0.86 + ((i * 3) % 7) * 0.028)
    );

    const colors: string[] = [];
    for (let i = 0; i < markerPositions.length; i++) {
      if (i < 5) {
        colors.push(RANDOM_MARKER_HEX[i % RANDOM_MARKER_HEX.length]!);
      } else {
        colors.push(CLUSTER_HEX[(i - 5) % CLUSTER_HEX.length]!);
      }
    }
    const edgeGeometry = buildEdgeGeometry(markerPositions, colors, 36);

    /** Same topology as GLB triangles — lines stay glued to the mesh (avoids merge/de-index drift). */
    const wireGeometry = new THREE.WireframeGeometry(merged);
    merged.dispose();

    return {
      wireGeometry,
      scale: s,
      edgeGeometry,
      markerPositions,
      colors,
      markerRadii,
    };
  }, [gltf]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Clamp delta to 100ms max to prevent massive rotation jumps when returning from inactive tabs
      const safeDelta = Math.min(delta, 0.1);
      groupRef.current.rotation.y += safeDelta * ROTATION_SPEED;
    }
  });

  if (!brain) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <BrainGltfWireframe
        wireGeometry={brain.wireGeometry}
        scale={brain.scale}
      />
      <GraphEdges geometry={brain.edgeGeometry} scale={brain.scale} />
      <PulsingMarkers
        positions={brain.markerPositions}
        hexColors={brain.colors}
        scale={brain.scale}
        markerRadii={brain.markerRadii}
      />
    </group>
  );
}

export function BrainVisualization() {
  return (
    <Canvas
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      camera={{
        position: [0, 0.35, 3.2],
        fov: 50,
        near: 0.01,
        far: 5000,
      }}
      onCreated={({ gl, scene }) => {
        scene.background = null;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={0.32} />
      <directionalLight position={[2.5, 5, 4]} intensity={0.65} />
      <directionalLight position={[-2.5, 2, -3]} intensity={0.18} />
      <Suspense fallback={null}>
        <GltfBrainScene />
      </Suspense>
    </Canvas>
  );
}
