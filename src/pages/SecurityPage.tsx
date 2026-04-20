import { Link } from "react-router-dom";
import { LegalDocumentLayout, LegalSection } from "@/components/landing/LegalDocumentLayout";

export function SecurityPage() {
  return (
    <LegalDocumentLayout title="Security" lastUpdated="April 20, 2026">
      <LegalSection heading="Overview">
        <p>
          We design Zenno with security in mind across the web app, authentication, APIs,
          and optional desktop components. This page summarizes our practices at a high
          level. It is not an exhaustive list and may be updated as the product evolves.
        </p>
      </LegalSection>

      <LegalSection heading="Authentication and accounts">
        <p>
          Sign-in is handled through industry-standard authentication (Firebase
          Authentication). We rely on secure token-based sessions and provider-supported
          protections such as password policies and account recovery where enabled.
          Protect your credentials and enable multi-factor authentication when available.
        </p>
      </LegalSection>

      <LegalSection heading="Transport and infrastructure">
        <p>
          Data between your browser and our services is transmitted over HTTPS (TLS).
          Backend infrastructure and databases are hosted with major cloud providers
          using their security and isolation features appropriate to our deployment.
        </p>
      </LegalSection>

      <LegalSection heading="Product data">
        <p>
          Analytics and desktop-related telemetry are processed to power your dashboard
          and features you enable. Access is tied to your account and operational needs.
          Limit data collection using in-product settings where offered, and review the{" "}
          <Link to="/privacy" style={{ color: "#7C4DFF" }}>
            Privacy Policy
          </Link>{" "}
          for details on categories of data.
        </p>
      </LegalSection>

      <LegalSection heading="Vulnerability reporting">
        <p>
          If you believe you have found a security vulnerability in Zenno, please
          report it through the official security or support channel listed in product
          documentation rather than public disclosure. We appreciate responsible reports
          and will work with you to understand and address valid issues.
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
