import { useState } from 'react';
import { RATING_PARAMS } from '../utils/tier.js';
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
        className="max-h-[92vh] w-full max-w-xl animate-slide-up overflow-y-auto border-3 border-ink bg-cream shadow-brutal-lg"
      >
        <div className="sticky top-0 flex items-center justify-between border-b-3 border-ink bg-tierS px-5 py-3">
          <h2 className="font-display uppercase">
            {done ? 'RATING SUBMITTED' : `RATE ${society.name}`}
          </h2>
          <button onClick={onClose} className="border-3 border-ink bg-white px-2 font-display shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            ✕
          </button>
        </div>

        <div className="p-5">
          {done ? (
            <div className="animate-pop-in py-10 text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 animate-wiggle items-center justify-center border-3 border-ink bg-tierA text-3xl shadow-brutal">
                ✓
              </div>
              <p className="font-display text-2xl uppercase">Thanks, neighbour!</p>
              <p className="mt-1 text-sm font-bold uppercase text-gray-600">Your rating is live.</p>
            </div>
          ) : (
            <>
              {/* progress */}
              <div className="mb-5 flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 border-2 border-ink ${step >= s ? 'bg-tierS' : 'bg-white'}`}
                  />
                ))}
              </div>

              {step === 1 && (
                <div className="animate-pop-in text-center">
                  <h3 className="font-display text-xl uppercase">How would you rate this society?</h3>
                  <p className="mt-1 text-sm font-bold uppercase text-gray-600">{society.sector}, Gurgaon</p>
                  <div className="my-6 flex justify-center">
                    <StarRating value={quick} onChange={setQuick} size="text-5xl" />
                  </div>
                  <button
                    disabled={!quick}
                    onClick={() => setStep(2)}
                    className="brutal-btn w-full bg-tierS text-lg"
                  >
                    Next →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="animate-pop-in">
                  <h3 className="mb-4 font-display text-lg uppercase">Rate all ten parameters</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {RATING_PARAMS.map((p) => (
                      <div key={p.key} className="flex items-center justify-between gap-2 border-3 border-ink bg-paper px-3 py-2 shadow-brutal-sm">
                        <span className="text-sm font-bold uppercase">{p.label}</span>
                        <select
                          value={params[p.key]}
                          onChange={(e) => setParam(p.key, Number(e.target.value))}
                          className="w-16 border-3 border-ink bg-white px-1 py-1 font-display"
                          style={{ background: params[p.key] ? '#FFDD00' : '#fff' }}
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
                    <button onClick={() => setStep(1)} className="brutal-btn bg-white">← Back</button>
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
                      className="brutal-btn flex-1 bg-tierS"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-pop-in">
                  <h3 className="font-display text-lg uppercase">Want to tell other residents why?</h3>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Optional — write a comment..."
                    rows={4}
                    maxLength={2000}
                    className="mt-3 w-full border-3 border-ink bg-paper p-3 font-semibold outline-none focus:shadow-brutal-sm"
                  />
                  {error && <p className="mt-2 border-3 border-ink bg-tierD px-3 py-2 text-sm font-bold text-white">{error}</p>}
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => setStep(2)} className="brutal-btn bg-white">← Back</button>
                    <button onClick={submit} disabled={submitting} className="brutal-btn flex-1 bg-tierA text-lg disabled:opacity-60">
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
