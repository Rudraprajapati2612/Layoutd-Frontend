import { ImageResponse } from "next/og";

export const alt = "layoutd — Account migrations you can prove safe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const verdicts = [
  { label: "SAFE", color: "#4F7A52", bg: "#EEF5EE" },
  { label: "REVIEW", color: "#B8730A", bg: "#FDF4E7" },
  { label: "DANGER", color: "#B23A2E", bg: "#FBF0EE" },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#F5F2EC",
          color: "#1E1B2E",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 36,
            fontFamily: "monospace",
            color: "#4A4660",
          }}
        >
          layoutd_
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 600, lineHeight: 1.1 }}>
            Change an account.
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 600, lineHeight: 1.1 }}>
            <span style={{ color: "#C2562E" }}>Don’t corrupt</span>
            <span>&nbsp;the chain.</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {verdicts.map((v) => (
            <div
              key={v.label}
              style={{
                display: "flex",
                padding: "10px 24px",
                borderRadius: 999,
                fontSize: 26,
                fontFamily: "monospace",
                fontWeight: 600,
                color: v.color,
                backgroundColor: v.bg,
                border: `2px solid ${v.color}`,
              }}
            >
              {v.label}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              fontSize: 26,
              fontFamily: "monospace",
              color: "#6E6B7E",
            }}
          >
            cargo install layoutd
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
