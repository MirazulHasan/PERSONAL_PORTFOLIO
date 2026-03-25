"use client";

import { useState } from "react";
import * as htmlToImage from "html-to-image";

export default function DownloadImageButton({ name }: { name?: string | null }) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        const card = document.getElementById("cv-card");
        if (!card) return;

        try {
            // Give the browser 500ms to ensure all fonts and SVG icons are fully settled
            await new Promise(resolve => setTimeout(resolve, 500));

            // html-to-image guarantees 1-to-1 visual correspondence and correctly parses layout
            // We use a high scale (3x) for razor-sharp result.
            const dataUrl = await htmlToImage.toPng(card, {
                pixelRatio: 3, 
                backgroundColor: "#0a0a0f",
                style: {
                    borderRadius: "0px",
                    boxShadow: "none",
                    border: "none"
                }
            });

            const link = document.createElement("a");
            const fileName = name?.replace(/\s+/g, "_") || "CV";
            link.download = `${fileName}_Portfolio_PNG.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Image generation failed:", error);
            alert("Image generation failed. Please try the PDF version or check console for errors.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            title="Download CV as high-resolution PNG"
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 22px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                color: "var(--text-primary)",
                fontSize: 13,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.25s",
                letterSpacing: "0.03em",
                whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
                if (!loading) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {loading ? (
                <>
                    <span style={{
                        width: 14, height: 14, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.2)",
                        borderTopColor: "#fff",
                        animation: "spin 0.8s linear infinite",
                        display: "inline-block"
                    }} />
                    Processing…
                </>
            ) : (
                <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                    Download PNG
                </>
            )}
        </button>
    );
}
