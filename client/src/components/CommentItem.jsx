import { useState } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../utils/format.js';
import api from '../utils/api.js';
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
    <div className="flex w-10 shrink-0 flex-col items-center gap-0.5 border-r-3 border-ink bg-cream py-2">
      <button
        onClick={() => vote('up')}
        aria-label="Upvote"
        className={`leading-none transition-transform ${anim === 'up' ? 'scale-125' : 'hover:scale-110'}`}
      >
        ▲
      </button>
      <span className="font-display text-sm">{score}</span>
      <button
        onClick={() => vote('down')}
        aria-label="Downvote"
        className={`leading-none transition-transform ${anim === 'down' ? 'scale-125' : 'hover:scale-110'}`}
      >
        ▼
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
    <div className={`border-3 border-ink bg-paper shadow-brutal-sm ${depth > 0 ? '' : 'mb-4'}`}>
      <div className="flex">
        <VoteBox comment={comment} onVoted={onVoted} />
        <div className="min-w-0 flex-1 p-3">
          <div className="flex flex-wrap items-center gap-x-2 text-xs font-bold uppercase">
            <Link to={`/u/${comment.userId?.username}`} className="hover:underline">
              @{comment.userId?.username || 'anon'}
            </Link>
            <span className="text-gray-500">{timeAgo(comment.createdAt)}</span>
            {(comment.tags || []).map((t) => (
              <span key={t} className="border-2 border-ink bg-tierS px-1 leading-tight">#{t}</span>
            ))}
          </div>

          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed">{comment.body}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
            <button onClick={() => setReplying((v) => !v)} className="border-2 border-ink px-2 py-0.5 hover:bg-tierS">
              Reply
            </button>
            <button
              onClick={() => navigator.clipboard && navigator.clipboard.writeText(window.location.href)}
              className="border-2 border-ink px-2 py-0.5 hover:bg-tierS"
            >
              Share
            </button>
            {!reported ? (
              <button onClick={report} className="border-2 border-transparent px-2 py-0.5 text-gray-500 hover:border-ink">
                Report
              </button>
            ) : (
              <span className="px-2 py-0.5 text-gray-500">Reported ✓</span>
            )}
            {replies.length > 0 && (
              <button onClick={() => setShowReplies((v) => !v)} className="ml-auto text-blue-700 underline">
                {showReplies ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>

          {replying && (
            <div className="mt-3 animate-slide-up border-t-2 border-dashed border-ink/30 pt-3">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={2}
                placeholder={`Reply to @${comment.userId?.username || 'anon'}...`}
                className="w-full border-3 border-ink bg-white p-2 outline-none"
              />
              <div className="mt-2 flex flex-wrap items-center gap-1">
                <span className="text-xs font-bold uppercase text-gray-600">Tag:</span>
                {COMMENT_TAGS.slice(0, 6).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(tag === t ? '' : t)}
                    className={`border-2 border-ink px-1.5 py-0.5 text-[10px] font-bold ${
                      tag === t ? 'bg-tierS' : 'bg-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <button onClick={submitReply} className="brutal-btn ml-auto bg-tierA !px-3 !py-1 !text-xs">
                  Post Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Threaded replies — indented with a strong connector border */}
      {showReplies && replies.length > 0 && (
        <div className="ml-6 space-y-3 border-l-4 border-ink bg-cream/60 p-3 sm:ml-12">
          {replies.map((r) => (
            <CommentItem key={r._id} comment={r} societySlug={societySlug} depth={depth + 1} onVoted={onVoted} />
          ))}
        </div>
      )}
    </div>
  );
}
