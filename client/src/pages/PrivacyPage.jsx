import { ShieldCheck, EnvelopeSimple, Lock, ChartBar, Key, Buildings, GitBranch } from '@phosphor-icons/react';
import { useSEO } from '../utils/seo.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import Reveal from '../components/ui/Reveal.jsx';

const SECTIONS = [
  {
    icon: GitBranch,
    title: 'Open-source project',
    body: (
      <p>
        GurgaonFlat is a free, open-source community project operating at{' '}
        <a href="https://gurgaonflat.online" className="font-semibold text-ink underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-ink">gurgaonflat.online</a>.
        The code is public and auditable — there is no hidden tracking, no broker-paid
        placement, and no pay-to-rank. If you can read code, you can verify everything here yourself.
      </p>
    )
  },
  {
    icon: ChartBar,
    title: 'What we collect',
    body: (
      <ul className="space-y-2">
        <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />Your ratings and reviews (linked to an anonymous guest identity by default).</li>
        <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />An email only if you choose to sign up — otherwise we store no contact details.</li>
        <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />Basic IP-based rate limiting to prevent spam (not used to profile you).</li>
      </ul>
    )
  },
  {
    icon: ShieldCheck,
    title: 'How ratings work',
    body: (
      <p>
        Ratings are confidence-adjusted using a Bayesian average so a society can&apos;t be
        manipulated by a handful of accounts. Every visitor gets a silent guest identity with no
        signup wall; you can rate and comment immediately.
      </p>
    )
  },
  {
    icon: Key,
    title: 'Authentication & passwords',
    body: (
      <p>
        If you create an account, your password is hashed with bcrypt before storage — we never
        see or store the plain text. Sessions use a signed JWT that expires in 7 days.
      </p>
    )
  },
  {
    icon: Buildings,
    title: 'Third-party services',
    body: (
      <ul className="space-y-2">
        <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" /><strong className="font-semibold text-ink">Google Maps</strong> — powers the society map. Google may set its own cookies.</li>
        <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" /><strong className="font-semibold text-ink">WAQI</strong> — provides the live AQI reading shown on society pages.</li>
        <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" /><strong className="font-semibold text-ink">MongoDB Atlas</strong> — hosts the database. Their privacy policy applies to data-at-rest.</li>
      </ul>
    )
  },
  {
    icon: Lock,
    title: 'Your choices',
    body: (
      <p>
        You can use the entire site as a guest without providing any personal information. To
        request deletion of any content tied to your identity, email the developer below.
      </p>
    )
  },
  {
    icon: EnvelopeSimple,
    title: 'Contact',
    body: (
      <p>
        This project is maintained by an independent developer. Reach out at{' '}
        <a href="mailto:creation2224@gmail.com" className="font-semibold text-ink underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-ink">creation2224@gmail.com</a>.
      </p>
    )
  }
];

export default function PrivacyPage() {
  useSEO({ title: 'Privacy Policy — GurgaonFlat', path: '/privacy' });

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy"
        accent="Policy"
        intro="How we handle the small amount of data this open-source project touches — and the controls you keep."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Privacy' }]}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Last updated: {new Date().getFullYear()}
        </p>
      </PageHeader>

      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-8">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                    <s.icon weight="duotone" className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-xl font-bold tracking-tight text-ink">{s.title}</h2>
                </div>
                <div className="mt-4 text-[15px] leading-relaxed text-slate-600">{s.body}</div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
