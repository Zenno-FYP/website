import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export function LegalDocumentLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#0A0A0F",
        color: "#A7B0BE",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <header
        className="px-6 py-4"
        style={{
          borderBottom: "1px solid rgba(91, 111, 216, 0.1)",
          background: "rgba(10, 10, 15, 0.9)",
        }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <img
              src={logo}
              alt=""
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <span
              style={{
                color: "#F5F7FA",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Zenno
            </span>
          </Link>
          <Link
            to="/"
            className="shrink-0 transition-colors hover:text-purple-400"
            style={{ fontSize: "0.875rem", color: "#7C4DFF" }}
          >
            Back to home
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10 pb-16">
        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "#F5F7FA",
            marginBottom: "0.5rem",
            fontFamily: "Space Grotesk, sans-serif",
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: "0.8125rem", color: "#6F7885", marginBottom: "2rem" }}>
          Last updated: {lastUpdated}
        </p>
        <div
          className="legal-doc-content"
          style={{
            lineHeight: 1.75,
            fontSize: "0.9375rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "#F5F7FA",
          marginBottom: "0.75rem",
          fontFamily: "Space Grotesk, sans-serif",
        }}
      >
        {heading}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {children}
      </div>
    </section>
  );
}
