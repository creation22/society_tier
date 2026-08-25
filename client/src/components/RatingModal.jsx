import { useState } from 'react';
import { Star, X, Check, ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import { RATING_PARAMS } from '../utils/tier.js';
import { cn } from '../utils/cn.js';
import StarRating from './StarRating.jsx';
import api from '../utils/api.js';

/**
 * 3-step rating flow: quick overall stars -> all ten parameters ->
 * optional review text. Guests are sent to login.
 */
export default function RatingModal({ society, onClose, onRated }) {
  const [step, setStep] = useState(1);
  const [quick, setQuick] = useState(0);
  const [params, setParams] = useState(Object.fromEntries(RATING_PARAMS.map((p) => [p.key, 0])));
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function setParam(key, val) {
    setParams((prev) => ({ ...prev, [key]: val }));
  }

  async function submit() {
    setError('');
    const incomplete = RATING_PARAMS.filter((p) => !params[p.key]);
    if (incomplete.length) {
      setError(`Please rate: ${incomplete.map((p) => p.label).join(', ')}`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post(`/societies/${society.slug}/ratings`, params);
      if (review.trim()) {
        await api.post(`/societies/${society.slug}/comments`, {
          body: review.trim(),
          tags: []
        }).catch(() => {});
      }
      setDone(true);
      setTimeout(() => onRated(res.data.society), 1400);
    } catch (e) {
      setError(e.response?.data?.error || 'Could not submit rating');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-cream shadow-2xl animate-slide-up"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-slate-50 px-5 py-3 border-b border-slate-100">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">
            {done ? 'Rating Submitted' : `Rate ${society.name}`}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-ink"
          >
            <X weight="bold" className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {done ? (
            <div className="py-10 text-center animate-pop-in">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 animate-wiggle items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                <Check weight="bold" className="h-8 w-8" />
              </div>
              <p className="font-display text-2xl font-bold tracking-tight text-ink">Thanks, neighbour!</p>
              <p className="mt-1 text-sm font-medium text-slate-500">Your rating is live.</p>
            </div>
          ) : (
            <>
              {/* progress */}
              <div className="mb-5 flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      step >= s ? 'bg-ink' : 'bg-slate-200'
                    )}
                  />
                ))}
              </div>

              {step === 1 && (
                <div className="text-center animate-pop-in">
                  <h3 className="font-display text-xl font-bold tracking-tight text-ink">How would you rate this society?</h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">{society.sector}, Gurgaon</p>
                  <div className="my-6 flex justify-center">
                    <StarRating value={quick} onChange={setQuick} size="text-5xl" />
                  </div>
                  <button
                    disabled={!quick}
                    onClick={() => setStep(2)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 font-display text-base font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
                  >
                    Next <ArrowRight weight="bold" className="h-4 w-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="animate-pop-in">
                  <h3 className="mb-4 font-display text-lg font-bold tracking-tight text-ink">Rate all ten parameters</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {RATING_PARAMS.map((p) => (
                      <div key={p.key} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <span className="text-sm font-medium text-slate-700">{p.label}</span>
                        <select
                          value={params[p.key]}
                          onChange={(e) => setParam(p.key, Number(e.target.value))}
                          className="w-16 rounded-lg border border-slate-200 bg-white px-1 py-1 font-display text-sm text-ink outline-none focus:border-slate-400"
                        >
                          <option value={0}>–</option>
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-display text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <ArrowLeft weight="bold" className="h-4 w-4" /> Back
                    </button>
                    <button
                      onClick={() => {
                        const missing = RATING_PARAMS.filter((p) => !params[p.key]);
                        if (missing.length) {
                          setError(`Please rate: ${missing.map((p) => p.label).join(', ')}`);
                          return;
                        }
                        setError('');
                        setStep(3);
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 font-display text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      Next <ArrowRight weight="bold" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-pop-in">
                  <h3 className="font-display text-lg font-bold tracking-tight text-ink">Want to tell other residents why?</h3>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Optional — write a comment..."
                    rows={4}
                    maxLength={2000}
                    className="mt-3 w-full rounded-lg border border-slate-200 bg-white p-3 font-body outline-none focus:border-slate-400 focus:ring-2 focus:ring-ink/10"
                  />
                  {error && (
                    <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>
                  )}
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-display text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <ArrowLeft weight="bold" className="h-4 w-4" /> Back
                    </button>
                    <button
                      onClick={submit}
                      disabled={submitting}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-display text-base font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
                    >
                      <Star weight="fill" className="h-4 w-4" />
                      {submitting ? 'Submitting…' : 'Submit Rating'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
