import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

export const alt = "DOGFOOD 2026 Project Preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { team: true, track: true },
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: "#0a0e1c",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(0, 229, 208, 0.25) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(35, 48, 88, 0.5) 0%, transparent 60%)",
          color: "#e6ecff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              backgroundColor: "#00e5d0",
              color: "#0a0e1c",
              padding: "6px 16px",
              fontSize: "18px",
              fontWeight: 800,
              borderRadius: "6px",
              letterSpacing: "1px",
            }}
          >
            DOGFOOD 2026
          </div>
          <div
            style={{
              color: "#aebad6",
              fontSize: "20px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {project?.track.name ?? "Category Submission"}
          </div>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "60px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-1.5px",
              lineHeight: 1.05,
              color: "#e6ecff",
            }}
          >
            {project?.title ?? "Project Submission"}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#aebad6",
              lineHeight: 1.4,
              maxWidth: "960px",
            }}
          >
            {project?.summary ?? ""}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #233058",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#6b7a9e",
          }}
        >
          <div>
            Team: <span style={{ color: "#e6ecff", fontWeight: 700 }}>{project?.team.name ?? "Team"}</span>
          </div>
          <div style={{ color: "#00e5d0", fontWeight: 700 }}>
            Autonomous Hackathon Evaluation
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
