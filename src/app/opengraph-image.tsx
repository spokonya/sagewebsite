import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Sage — Your Voice-First Second Brain";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E1D1A",
          color: "#D6D6D6",
          fontFamily: "Georgia, serif"
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 300,
            letterSpacing: "-1px",
            marginBottom: 24
          }}
        >
          Speak your mind.
        </div>
        <div style={{ fontSize: 36, color: "#9B8A7A", fontStyle: "italic" }}>
          Watch it come alive.
        </div>
      </div>
    ),
    { ...size }
  );
}
