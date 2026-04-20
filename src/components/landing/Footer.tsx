import { Link, useLocation } from "react-router-dom";

import logo from "@/assets/logo.png";

/** Same-page anchors so they work on both `/` and `/home` without sending logged-in users to `/`. */
const productAnchorLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
] as const;

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Security", to: "/security" },
] as const;

export function Footer() {
  const { pathname } = useLocation();
  const brandTo = pathname === "/home" ? "/home" : "/";

  return (
    <footer className="landing-footer">
      <div className="max-w-7xl mx-auto">
        <div className="landing-footer-grid">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Link to={brandTo}>
                <img
                  src={logo}
                  alt="Zenno"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </Link>
            </div>
            <p
              className="mb-6 max-w-sm"
              style={{
                fontSize: "0.9375rem",
                color: "#A7B0BE",
                lineHeight: "1.7",
              }}
            >
              Desktop activity intelligence for developers. Understand how you work,
              protect your focus, and code with more intention.
            </p>
            <div
              className="px-4 py-2 rounded-lg inline-block"
              style={{
                background: "rgba(91, 111, 216, 0.1)",
                border: "1px solid rgba(91, 111, 216, 0.3)",
                color: "#7C4DFF",
                fontSize: "0.875rem",
              }}
            >
              Privacy-aware desktop tracking
            </div>
          </div>

          <div>
            <h3
              className="mb-4"
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#F5F7FA",
              }}
            >
              Product
            </h3>
            <ul className="space-y-3">
              {productAnchorLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-purple-500"
                    style={{
                      fontSize: "0.9375rem",
                      color: "#A7B0BE",
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/auth"
                  className="transition-colors hover:text-purple-500"
                  style={{
                    fontSize: "0.9375rem",
                    color: "#A7B0BE",
                  }}
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="mb-4"
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#F5F7FA",
              }}
            >
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="transition-colors hover:text-purple-500"
                    style={{
                      fontSize: "0.9375rem",
                      color: "#A7B0BE",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t"
          style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
        >
          <p style={{ fontSize: "0.875rem", color: "#6F7885" }}>
            © 2026 Zenno. Built for developers who want clarity.
          </p>
        </div>
      </div>
    </footer>
  );
}
