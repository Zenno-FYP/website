import { LegalDocumentLayout, LegalSection } from "@/components/landing/LegalDocumentLayout";

export function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout title="Privacy Policy" lastUpdated="April 20, 2026">
      <LegalSection heading="Overview">
        <p>
          Zenno (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) provides developer
          analytics and related services through this website, optional desktop
          software, and connected experiences. This policy describes how we collect,
          use, and share personal information when you use Zenno.
        </p>
      </LegalSection>

      <LegalSection heading="Information we collect">
        <p>
          <strong style={{ color: "#E5E7EB" }}>Account and authentication.</strong> When
          you create an account or sign in, we process information you provide (such as
          email address and display name) and identifiers from our authentication
          provider (Firebase Authentication), including a user ID and security-related
          metadata needed to protect your account.
        </p>
        <p>
          <strong style={{ color: "#E5E7EB" }}>Product usage and desktop activity.</strong>{" "}
          If you use the Zenno desktop agent or related features, we process activity
          and productivity signals as described in the product (for example, time in
          focus, applications and languages used, and project-related metrics) so we can
          show analytics, insights, and optional AI-assisted nudges. This data is tied to
          your account and processed to operate the service you requested.
        </p>
        <p>
          <strong style={{ color: "#E5E7EB" }}>Technical and service data.</strong> We
          may collect device or browser information, log data, diagnostics, and
          performance information to keep the service secure, troubleshoot issues, and
          understand aggregate usage.
        </p>
      </LegalSection>

      <LegalSection heading="How we use information">
        <ul style={{ paddingLeft: "1.25rem", listStyleType: "disc" }} className="space-y-2">
          <li>To provide, maintain, and improve Zenno features and the dashboard.</li>
          <li>To authenticate you, protect accounts, and prevent abuse or fraud.</li>
          <li>To communicate with you about the service (for example, security or product notices).</li>
          <li>To comply with law and enforce our terms.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Legal bases (where applicable)">
        <p>
          Depending on your region, we rely on appropriate legal bases such as
          performance of a contract, legitimate interests (for example, securing our
          services and understanding aggregate usage), and consent where required.
        </p>
      </LegalSection>

      <LegalSection heading="Sharing and subprocessors">
        <p>
          We use trusted infrastructure providers to run Zenno. For example, we use
          Google Firebase for authentication and related cloud services as configured in
          your project. Those providers process data under their terms and, where
          applicable, as subprocessors under our instructions for providing the service.
          We do not sell your personal information.
        </p>
      </LegalSection>

      <LegalSection heading="Retention">
        <p>
          We retain information for as long as your account is active and as needed to
          provide the service, comply with legal obligations, resolve disputes, and
          enforce our agreements. Retention periods may vary by data category and product
          settings.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices and rights">
        <p>
          Depending on where you live, you may have rights to access, correct, delete, or
          export personal information, or to object to or restrict certain processing. You
          can manage some information in your account or app settings. You may also
          contact us to exercise applicable rights; we may need to verify your request.
        </p>
      </LegalSection>

      <LegalSection heading="Children">
        <p>
          Zenno is not directed at children under 16, and we do not knowingly collect
          personal information from children.
        </p>
      </LegalSection>

      <LegalSection heading="International transfers">
        <p>
          If you use Zenno from outside the country where our infrastructure is hosted,
          your information may be transferred and processed in other countries where we
          or our providers operate, subject to appropriate safeguards as required by
          law.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          We may update this policy from time to time. We will post the updated version
          on this page and adjust the &quot;Last updated&quot; date. Continued use of
          Zenno after changes means you accept the updated policy where permitted by law.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          For privacy-related questions or requests, contact us using the support or
          contact channel provided in your Zenno account experience or product
          documentation.
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
