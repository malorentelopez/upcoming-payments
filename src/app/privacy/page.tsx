import { LegalLink, LegalPage } from "@/components/legal/legal-page";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Last updated: June 25, 2026. This policy explains how ahead collects, uses, and protects your personal data under the GDPR."
    >
      <section>
        <h2>1. Who we are</h2>
        <p>
          <strong>ahead</strong> (“we”, “us”, “our”) is the operator of the ahead
          web application that helps you track upcoming payments. For GDPR purposes,
          we are the <strong>data controller</strong> for personal data processed
          through the service.
        </p>
        <p>
          Contact:{" "}
          <a href="mailto:malorentelopez@gmail.com" className="text-primary hover:underline">
            malorentelopez@gmail.com
          </a>
        </p>
      </section>

      <section>
        <h2>2. What data we collect</h2>
        <ul>
          <li>
            <strong>Account data:</strong> email address, display name, authentication
            identifiers (including when you sign in with Google).
          </li>
          <li>
            <strong>Profile data:</strong> default currency, timezone, language, and
            preferences you save in the app.
          </li>
          <li>
            <strong>Payment data you enter:</strong> names, amounts, categories, due
            dates, notes, and recurrence rules for your upcoming payments.
          </li>
          <li>
            <strong>Technical data:</strong> session cookies required to keep you
            signed in, language and theme preferences, and cookie-consent choices
            stored in your browser.
          </li>
          <li>
            <strong>Analytics data (with consent):</strong> anonymous page views and
            performance metrics via Vercel Analytics and Speed Insights.
          </li>
        </ul>
        <p>We do not collect bank credentials or execute payments on your behalf.</p>
      </section>

      <section>
        <h2>3. Why we use your data (legal bases)</h2>
        <ul>
          <li>
            <strong>Contract (Art. 6(1)(b) GDPR):</strong> to create your account,
            store your payments, and provide the service you request.
          </li>
          <li>
            <strong>Consent (Art. 6(1)(a) GDPR):</strong> for analytics cookies and
            scripts (only if you opt in).
          </li>
          <li>
            <strong>Legitimate interests (Art. 6(1)(f) GDPR):</strong> to keep the
            service secure, prevent abuse, and improve reliability.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Processors and third parties</h2>
        <p>We use trusted providers to run the app:</p>
        <ul>
          <li>
            <strong>Supabase</strong> — authentication and database hosting (EU/US
            regions depending on your project configuration).
          </li>
          <li>
            <strong>Google</strong> — optional OAuth sign-in if you choose it.
          </li>
          <li>
            <strong>Vercel</strong> — application hosting, delivery, and (with your
            consent) analytics and performance monitoring.
          </li>
        </ul>
        <p>
          We do not sell your personal data. Processors act on our instructions under
          data processing agreements where required.
        </p>
      </section>

      <section>
        <h2>5. International transfers</h2>
        <p>
          If data is transferred outside the UK/EEA, we rely on appropriate safeguards
          such as Standard Contractual Clauses or equivalent mechanisms offered by our
          providers.
        </p>
      </section>

      <section>
        <h2>6. Retention and deletion</h2>
        <p>
          We keep your account and payment data while your account is active. You can
          delete your account at any time from <strong>Me → Delete account</strong> in
          the app. This permanently removes your profile, categories, payments, and
          authentication record. If you cannot use the app, email us to request
          erasure. We complete deletion within a reasonable period, except where law
          requires longer retention.
        </p>
      </section>

      <section>
        <h2>7. Your rights</h2>
        <p>Under the GDPR you may have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Rectify inaccurate data</li>
          <li>Erase your data (“right to be forgotten”)</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time (for consent-based processing)</li>
          <li>Lodge a complaint with your local supervisory authority</li>
        </ul>
        <p>
          To exercise your rights, email{" "}
          <a href="mailto:malorentelopez@gmail.com" className="text-primary hover:underline">
            malorentelopez@gmail.com
          </a>
          . You can also manage cookies in{" "}
          <LegalLink href="/cookies">Cookie Policy</LegalLink> or from Settings once
          signed in.
        </p>
      </section>

      <section>
        <h2>8. Security</h2>
        <p>
          We use industry-standard measures including encrypted connections (HTTPS),
          row-level security in our database, access controls, and HTTP security
          headers. No method of transmission over the internet is 100% secure.
        </p>
      </section>

      <section>
        <h2>9. Children</h2>
        <p>
          ahead is not intended for users under 16. We do not knowingly collect data
          from children.
        </p>
      </section>

      <section>
        <h2>10. Changes</h2>
        <p>
          We may update this policy. We will post the new version on this page and
          update the “Last updated” date. Material changes may be communicated in the
          app where appropriate.
        </p>
      </section>
    </LegalPage>
  );
}
