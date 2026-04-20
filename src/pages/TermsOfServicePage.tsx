import { LegalDocumentLayout, LegalSection } from "@/components/landing/LegalDocumentLayout";

export function TermsOfServicePage() {
  return (
    <LegalDocumentLayout title="Terms of Service" lastUpdated="April 20, 2026">
      <LegalSection heading="Agreement">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of
          Zenno&apos;s websites, applications, and related services (collectively, the
          &quot;Services&quot;). By creating an account, downloading software, or using
          the Services, you agree to these Terms.
        </p>
      </LegalSection>

      <LegalSection heading="The Services">
        <p>
          Zenno provides tools for developers to understand coding habits and focus,
          including analytics dashboards, optional desktop activity features, and related
          functionality. Features may change during beta or early access; we may add,
          modify, or discontinue functionality with reasonable notice where appropriate.
        </p>
      </LegalSection>

      <LegalSection heading="Accounts">
        <p>
          You must provide accurate registration information and keep your credentials
          secure. You are responsible for activity under your account. Notify us promptly
          of unauthorized use.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>You agree not to:</p>
        <ul style={{ paddingLeft: "1.25rem", listStyleType: "disc" }} className="space-y-2">
          <li>Use the Services in violation of law or third-party rights.</li>
          <li>Attempt to probe, scan, or test the vulnerability of our systems without authorization.</li>
          <li>Interfere with or disrupt the Services or other users&apos; access.</li>
          <li>Reverse engineer or attempt to extract source code except where laws allow.</li>
          <li>Use the Services to distribute malware or harmful content.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Software">
        <p>
          If we offer downloadable software (such as a desktop agent), your use is also
          subject to any license terms presented at installation or in-product. Unless
          stated otherwise, we grant you a limited, non-exclusive, non-transferable
          license to use the software solely to access the Services.
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>
          The Services, including software, branding, and content we provide, are
          owned by Zenno or its licensors and are protected by intellectual property
          laws. Except for the rights expressly granted in these Terms, no rights are
          transferred to you.
        </p>
      </LegalSection>

      <LegalSection heading="Disclaimers">
        <p>
          THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE
          MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, WHETHER EXPRESS,
          IMPLIED, OR STATUTORY, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE
          UNINTERRUPTED OR ERROR-FREE.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZENNO AND ITS SUPPLIERS WILL NOT BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
          DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF
          THE SERVICES. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS OR
          THE SERVICES IS LIMITED TO THE GREATER OF AMOUNTS YOU PAID US FOR THE SERVICES
          IN THE TWELVE MONTHS BEFORE THE CLAIM OR ONE HUNDRED DOLLARS (US$100), IF
          APPLICABLE. SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; IN THOSE CASES,
          OUR LIABILITY IS LIMITED TO THE FULLEST EXTENT PERMITTED BY LAW.
        </p>
      </LegalSection>

      <LegalSection heading="Indemnity">
        <p>
          You will defend and indemnify Zenno and its affiliates against claims arising
          from your misuse of the Services or violation of these Terms, to the extent
          permitted by law.
        </p>
      </LegalSection>

      <LegalSection heading="Termination">
        <p>
          You may stop using the Services at any time. We may suspend or terminate access
          if you materially breach these Terms or if we must do so to comply with law or
          protect the Services. Provisions that by their nature should survive will
          survive termination.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>
          These Terms are governed by the laws applicable to your contracting entity as
          determined by Zenno, without regard to conflict-of-law rules, except where
          mandatory consumer protections in your country apply.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          We may update these Terms from time to time. We will post the updated Terms on
          this page and update the &quot;Last updated&quot; date. If changes are material,
          we will provide additional notice where required. Continued use after the
          effective date constitutes acceptance of the updated Terms where permitted.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          For questions about these Terms, use the contact or support options provided
          in your Zenno product experience.
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
