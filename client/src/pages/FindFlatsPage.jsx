import { RocketLaunch, EnvelopeSimple } from '@phosphor-icons/react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import SectionDivider from '../components/ui/SectionDivider.jsx';
import { useSEO } from '../utils/seo.js';

export default function FindFlatsPage() {
  useSEO({ title: 'Find Flats — Coming Soon | GurgaonFlat', path: '/find-flats' });

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Find Flats' }]}
        eyebrow="Coming soon"
        title="Find"
        accent="flats"
        intro="Verified rentals & resale listings inside rated societies. Launching next."
      >
        <a
          href="mailto:creation2224@gmail.com"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <EnvelopeSimple weight="duotone" className="h-4 w-4" />
          Request early access
        </a>
      </PageHeader>

      <section className="mx-auto max-w-3xl px-4 pb-24">
        <SectionDivider />
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
              <RocketLaunch weight="duotone" className="h-8 w-8" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">
              Built for the next move.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
              We are hand-curating every listing so you only see homes inside societies you can actually trust. Drop your email and we will let you in before the doors open.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
