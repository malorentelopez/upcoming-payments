import { LegalLink, LegalPage } from "@/components/legal/legal-page";

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="Last updated: June 25, 2026. How ahead uses cookies and similar technologies."
    >
      <section>
        <h2>1. What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device. We also use similar
          technologies such as local storage for your cookie consent choice.
        </p>
      </section>

      <section>
        <h2>2. How we use cookies</h2>
        <p>Cookies fall into these categories:</p>
        <ul>
          <li>
            <strong>Essential</strong> — required for sign-in and security. These
            cannot be switched off while using the service.
          </li>
          <li>
            <strong>Functional</strong> — remember preferences including your cookie
            choices.
          </li>
          <li>
            <strong>Analytics</strong> — help us measure usage. We do not load
            analytics scripts today; this category is reserved for future use and only
            applies if you consent.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Cookies we use</h2>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/40">
              <tr>
                <th className="px-4 py-3 font-medium">Name / storage</th>
                <th className="px-4 py-3 font-medium">Purpose</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="px-4 py-3">Supabase auth cookies (sb-*)</td>
                <td className="px-4 py-3">Keep you signed in securely</td>
                <td className="px-4 py-3">Essential</td>
                <td className="px-4 py-3">Session / up to 1 year</td>
              </tr>
              <tr>
                <td className="px-4 py-3">ahead-cookie-consent (localStorage)</td>
                <td className="px-4 py-3">Records your cookie consent choice</td>
                <td className="px-4 py-3">Essential (compliance)</td>
                <td className="px-4 py-3">Until you clear browser data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>4. Managing your choices</h2>
        <p>
          On your first visit, we show a cookie banner where you can accept all
          cookies, reject non-essential cookies, or manage categories individually.
          Rejecting non-essential cookies is as easy as accepting them.
        </p>
        <p>
          You can change your mind at any time from Settings → Privacy & cookies (when
          signed in) or by clearing site data in your browser. Essential cookies will
          be set again when you sign in.
        </p>
      </section>

      <section>
        <h2>5. Browser controls</h2>
        <p>
          Most browsers let you block or delete cookies. Blocking essential cookies
          may prevent you from signing in.
        </p>
      </section>

      <section>
        <h2>6. More information</h2>
        <p>
          See our <LegalLink href="/privacy">Privacy Policy</LegalLink> for how we
          process personal data. Contact{" "}
          <a href="mailto:malorentelopez@gmail.com" className="text-primary hover:underline">
            malorentelopez@gmail.com
          </a>{" "}
          with any questions.
        </p>
      </section>
    </LegalPage>
  );
}
