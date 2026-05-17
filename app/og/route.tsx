import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #090a0c 0%, #121820 50%, #0a1210 100%)",
          color: "#f4f1ea",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontSize: 28, letterSpacing: "0.2em", color: "#c9a227" }}>JEZEROX</span>
          <span style={{ fontSize: 22, color: "#2dd4bf" }}>Lahore · PK</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            I build AI that works for your business.
          </div>
          <div style={{ fontSize: 28, color: "rgba(244,241,234,0.75)", maxWidth: 800 }}>
            Usama Akram — AI Architect & Full-Stack Engineer
          </div>
        </div>
        <div style={{ fontSize: 22, color: "rgba(244,241,234,0.55)" }}>
          Next.js · LangGraph · FastAPI · Claude API
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
