import { useCallback, useEffect, useState } from 'react';
import CommentItem from './CommentItem.jsx';
import api from '../utils/api.js';
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
        <h2 className="font-display text-xl uppercase sm:text-2xl">What are residents saying?</h2>
        <div className="ml-auto flex gap-1">
          {SORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`border-3 border-ink px-2.5 py-1 text-xs font-bold uppercase shadow-brutal-sm ${
                sort === s ? 'bg-ink text-cream' : 'bg-white hover:bg-tierS'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Compose */}
      <div className="mb-6 border-3 border-ink bg-paper p-3 shadow-brutal">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={5000}
          placeholder="Share your experience with this society."
          className="w-full resize-y border-3 border-ink bg-white p-2 outline-none focus:shadow-brutal-sm"
        />
        <div className="mt-2 flex flex-wrap items-center gap-1">
          <span className="text-xs font-bold uppercase text-gray-600">Tags:</span>
          {COMMENT_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={`border-2 border-ink px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
                tags.includes(t) ? 'bg-tierS' : 'bg-white hover:bg-tierS/50'
              }`}
            >
              #{t}
            </button>
          ))}
          <button
            onClick={post}
            disabled={posting || !body.trim()}
            className="brutal-btn ml-auto bg-tierS !py-1 !text-xs disabled:opacity-50"
          >
            {posting ? 'Posting…' : 'Comment'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 border-3 border-ink bg-tierD px-3 py-2 text-sm font-bold uppercase text-white shadow-brutal-sm">
          {error}
        </p>
      )}

      {/* List */}
      {!comments ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse border-3 border-ink bg-ink/10" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="border-3 border-dashed border-ink p-8 text-center font-bold uppercase text-gray-600">
          No comments yet. Be the first voice.
        </div>
      ) : (
        <div>
          {comments.map((c) => (
            <CommentItem key={c._id} comment={c} societySlug={societySlug} onVoted={applyVote} />
          ))}
        </div>
      )}
    </section>
  );
}
