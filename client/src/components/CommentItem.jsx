import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CaretUp, CaretDown, ArrowBendUpLeft, ShareNetwork, Siren } from '@phosphor-icons/react';
import { timeAgo } from '../utils/format.js';
import api from '../utils/api.js';
import { cn } from '../utils/cn.js';
import { COMMENT_TAGS } from '../utils/tier.js';

function VoteBox({ comment, onVoted }) {
  const [anim, setAnim] = useState('');
  const score = comment.upvotes - comment.downvotes;

  async function vote(type) {
    setAnim(type);
    setTimeout(() => setAnim(''), 250);
    try {
      const res = await api.post(`/comments/${comment._id}/vote`, { voteType: type });
      onVoted(comment._id, res.data);
    } catch {
      /* guests can't vote */
    }
  }

  return (
    <div className="flex w-10 shrink-0 flex-col items-center gap-1 rounded-l-xl bg-slate-50 py-2">
      <button
        onClick={() => vote('up')}
        aria-label="Upvote"
        className={cn(
          'leading-none text-slate-400 transition-transform hover:text-ink',
          anim === 'up' ? 'scale-125 text-ink' : 'hover:scale-110'
        )}
      >
        <CaretUp weight="fill" className="h-5 w-5" />
      </button>
      <span className="font-display text-sm font-semibold text-ink">{score}</span>
      <button
        onClick={() => vote('down')}
        aria-label="Downvote"
        className={cn(
          'leading-none text-slate-400 transition-transform hover:text-ink',
          anim === 'down' ? 'scale-125 text-ink' : 'hover:scale-110'
        )}
      >
        <CaretDown weight="fill" className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function CommentItem({ comment, societySlug, depth = 0, onVoted }) {
  const [replying, setReplying] = useState(false);
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('');
  const [showReplies, setShowReplies] = useState(true);
  const [reported, setReported] = useState(false);
  const replies = comment.replies || [];

  async function submitReply() {
    if (!body.trim()) return;
    try {
      await api.post(`/societies/${societySlug}/comments`, {
        body: body.trim(),
        parentCommentId: comment._id,
        tags: tag ? [tag] : []
      });
      window.location.reload(); // simplest correct refresh of the thread
    } catch {
      /* noop */
    }
  }

  async function report() {
    try {
      await api.post(`/comments/${comment._id}/report`, { reason: 'user report' });
      setReported(true);
    } catch {
      setReported(true);
    }
  }

  return (
    <div className={cn(
      'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
      depth > 0 ? '' : 'mb-0'
    )}>
      <div className="flex">
        <VoteBox comment={comment} onVoted={onVoted} />
        <div className="min-w-0 flex-1 p-3">
          <div className="flex flex-wrap items-center gap-x-2 text-xs">
            <Link to={`/u/${comment.userId?.username}`} className="font-semibold text-ink hover:underline">
              @{comment.userId?.username || 'anon'}
            </Link>
            <span className="text-slate-400">{timeAgo(comment.createdAt)}</span>
            {(comment.tags || []).map((t) => (
              <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">#{t}</span>
            ))}
          </div>

          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700">{comment.body}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setReplying((v) => !v)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowBendUpLeft weight="bold" className="h-3.5 w-3.5" /> Reply
            </button>
            <button
              onClick={() => navigator.clipboard && navigator.clipboard.writeText(window.location.href)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <ShareNetwork weight="bold" className="h-3.5 w-3.5" /> Share
            </button>
            {!reported ? (
              <button
                onClick={report}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-slate-400 transition hover:text-rose-600"
              >
                <Siren weight="bold" className="h-3.5 w-3.5" /> Report
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 font-medium text-slate-400">
                <Siren weight="bold" className="h-3.5 w-3.5" /> Reported
              </span>
            )}
            {replies.length > 0 && (
              <button
                onClick={() => setShowReplies((v) => !v)}
                className="ml-auto font-medium text-slate-500 underline-offset-2 hover:text-ink hover:underline"
              >
                {showReplies ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>

          {replying && (
            <div className="mt-3 border-t border-slate-100 pt-3 animate-slide-up">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={2}
                placeholder={`Reply to @${comment.userId?.username || 'anon'}...`}
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-ink/10"
              />
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tag:</span>
                {COMMENT_TAGS.slice(0, 6).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(tag === t ? '' : t)}
                    className={cn(
                      'rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors',
                      tag === t
                        ? 'border-ink bg-ink text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {t}
                  </button>
                ))}
                <button
                  onClick={submitReply}
                  className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  Post Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Threaded replies — indented with a subtle connector */}
      {showReplies && replies.length > 0 && (
        <div className="ml-6 space-y-3 border-l-2 border-slate-100 bg-slate-50/50 p-3 sm:ml-12">
          {replies.map((r) => (
            <CommentItem key={r._id} comment={r} societySlug={societySlug} depth={depth + 1} onVoted={onVoted} />
          ))}
        </div>
      )}
    </div>
  );
}
