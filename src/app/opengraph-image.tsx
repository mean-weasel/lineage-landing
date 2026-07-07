import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lineage - Design UX for human and agent collaboration";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          padding: 72,
          background: "#f5f8f7",
          color: "#14201f",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 38,
              height: 38,
              border: "4px solid #14201f",
              borderRadius: 10,
              background: "linear-gradient(135deg, #1f8f73 0 48%, #e65f46 48% 100%)",
              boxShadow: "8px 8px 0 #14201f",
            }}
          />
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800 }}>Lineage</div>
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 930,
            fontSize: 72,
            fontWeight: 850,
            lineHeight: 0.98,
          }}
        >
          The design UX for human and agent collaboration.
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 820,
            color: "#4f605c",
            fontSize: 29,
            lineHeight: 1.28,
          }}
        >
          Visual lineage graphs for people. JSON artifact trees for agents.
        </div>
      </div>
    ),
    { ...size },
  );
}
