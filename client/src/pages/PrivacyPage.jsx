import { useSEO } from '../utils/seo.js';

export default function PrivacyPage() {
  useSEO({ title: 'Privacy Policy — GurgaonFlat', path: '/privacy' });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl uppercase sm:text-5xl">Privacy Policy</h1>
      <p className="mt-2 text-sm font-bold uppercase text-gray-500">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-gray-700">
        <Section title="Open-source project">
          <p>
            GurgaonFlat is a free, open-source community project. The code is public and auditable —
            there is no hidden tracking, no broker-paid placement, and no pay-to-rank. If you can read
            code, you can verify everything here yourself.
          </p>
        </Section>

        <Section title="What we collect">
          <ul className="ml-5 list-disc space-y-1">
            <li>Your ratings and reviews (linked to an anonymous guest identity by default).</li>
            <li>An email only if you choose to sign up — otherwise we store no contact details.</li>
            <li>Basic IP-based rate limiting to prevent spam (not used to profile you).</li>
          </ul>
        </Section>

        <Section title="How ratings work">
          <p>
            Ratings are confidence-adjusted using a Bayesian average so a society can&apos;t be
            manipulated by a handful of accounts. Every visitor gets a silent guest identity with no
            signup wall; you can rate and comment immediately.
          </p>
        </Section>

        <Section title="Authentication & passwords">
          <p>
            If you create an account, your password is hashed with bcrypt before storage — we never
            see or store the plain text. Sessions use a signed JWT that expires in 7 days.
          </p>
        </Section>

        <Section title="Third-party services">
          <ul className="ml-5 list-disc space-y-1">
            <li><strong>Google Maps</strong> — powers the society map. Google may set its own cookies.</li>
            <li><strong>WAQI</strong> — provides the live AQI reading shown on society pages.</li>
            <li><strong>MongoDB Atlas</strong> — hosts the database. Their privacy policy applies to data-at-rest.</li>
          </ul>
        </Section>

        <Section title="Your choices">
          <p>
            You can use the entire site as a guest without providing any personal information. To
            request deletion of any content tied to your identity, email the developer below.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            This project is maintained by an independent developer. Reach out at{' '}
            <a href="mailto:creation2224@gmail.com" className="font-bold underline">creation2224@gmail.com</a>.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border-3 border-ink bg-paper p-5 shadow-brutal-sm">
      <h2 className="font-display text-lg uppercase">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
