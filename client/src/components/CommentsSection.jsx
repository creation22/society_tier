import { useCallback, useEffect, useState } from 'react';
import { ChatCircle, PaperPlaneTilt } from '@phosphor-icons/react';
import CommentItem from './CommentItem.jsx';
import EmptyState from './ui/EmptyState.jsx';
import api from '../utils/api.js';
import { cn } from '../utils/cn.js';
import { COMMENT_TAGS } from '../utils/tier.js';

const SORTS = ['top', 'new', 'controversial'];

export default function CommentsSection({ societySlug, user }) {
  const [comments, setComments] = useState(null);
  const [sort, setSort] = useState('top');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api
      .get(`/societies/${societySlug}/comments`, { params: { sort } })
      .then((res) => setComments(res.data.items))
      .catch(() => setComments([]));
  }, [societySlug, sort]);

  useEffect(load, [load]);

  function applyVote(id, counts) {
    setComments(function walk(list) {
      return list.map((c) =>
        c._id === id
          ? { ...c, ...counts }
          : { ...c, replies: walk(c.replies || []) }
      );
    });
  }

  async function post() {
    if (!body.trim()) return;
    setPosting(true);
    try {
      await api.post(`/societies/${societySlug}/comments`, { body: body.trim(), tags });
      setBody('');
      setTags([]);
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Could not post comment');
    } finally {
      setPosting(false);
    }
  }

  function toggleTag(t) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t].slice(0, 3)));
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
          What are residents saying?
        </h2>
        <div className="ml-auto flex gap-1">
          {SORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors',
                sort === s
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Compose */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={5000}
          placeholder="Share your experience with this society."
          className="w-full resize-y rounded-lg border border-slate-200 bg-white p-2 font-body text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-ink/10"
        />
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tags:</span>
          {COMMENT_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={cn(
                'rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium transition-colors',
                tags.includes(t)
                  ? 'bg-ink text-white border-ink'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              )}
            >
              #{t}
            </button>
          ))}
          <button
            onClick={post}
            disabled={posting || !body.trim()}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
          >
            <PaperPlaneTilt weight="fill" className="h-3.5 w-3.5" />
            {posting ? 'Posting…' : 'Comment'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}

      {/* List */}
      {!comments ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <EmptyState
          icon={ChatCircle}
          title="No comments yet"
          description="Be the first voice — share what it's really like living here."
        />
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <CommentItem key={c._id} comment={c} societySlug={societySlug} onVoted={applyVote} />
          ))}
        </div>
      )}
    </section>
  );
}
