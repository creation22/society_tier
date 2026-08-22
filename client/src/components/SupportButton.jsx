import { useState } from 'react';

const UPI_ID = 'srajangupta220-1@okicici';
const UPI_LINK = `upi://pay?pa=${UPI_ID}&pn=GurgaonFlat&tn=Support%20GurgaonFlat&cu=INR`;
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(UPI_LINK)}`;

/**
 * Floating "Support this project" button. Opens a brutalist card with a
 * UPI QR code so anyone can chip in. Rendered globally in MainLayout.
 */
export default function SupportButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <>
      <button
        aria-label="Support this project"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 border-3 border-ink bg-tierS px-3 py-2.5 font-display text-xs uppercase shadow-brutal-sm transition-all hover:shadow-brutal active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
      >
        <span className="text-base leading-none">♥</span>
        <span className="hidden sm:inline">Support</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4" onClick={() => setOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs border-3 border-ink bg-cream shadow-brutal-lg"
          >
            <div className="flex items-center justify-between border-b-3 border-ink bg-tierS px-4 py-2.5">
              <span className="font-display text-sm uppercase">Support this project</span>
              <button onClick={() => setOpen(false)} className="font-display leading-none">✕</button>
            </div>

            <div className="flex flex-col items-center p-5 text-center">
              <div className="border-3 border-ink bg-white p-2 shadow-brutal-sm">
                <img src={QR_URL} alt="UPI QR code" width={220} height={220} className="block" />
              </div>
              <p className="mt-3 text-xs font-bold uppercase text-gray-600">Scan with any UPI app</p>
              <button
                onClick={copy}
                className="mt-3 w-full border-3 border-ink bg-white px-3 py-2 font-mono text-sm font-bold shadow-brutal-sm transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                {copied ? 'Copied ✓' : UPI_ID}
              </button>
              <p className="mt-3 text-[11px] text-gray-500">
                GurgaonFlat is free &amp; open source. Your support keeps it ad-free.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
