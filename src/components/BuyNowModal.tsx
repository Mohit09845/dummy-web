'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { Product } from '@/data/products';

interface Store {
  name: string;
  href: string;
  bg: string;
  icon: ReactNode;
}

function getStores(platforms: Product['platforms']): Store[] {
  return [
    {
      name: 'Blinkit',
      href: platforms.blinkit,
      bg: '#F8CB46',
      icon: <Image src="/assets/logos/blinkit.webp" alt="" width={56} height={56} className="object-contain scale-[1.35]" unoptimized />,
    },
    {
      name: 'Zepto',
      href: 'https://www.zeptonow.com/',
      bg: '#3C006B',
      icon: <span className="text-[13px] font-extrabold tracking-tight text-white">zepto</span>,
    },
    {
      name: 'Swiggy Instamart',
      href: 'https://www.swiggy.com/instamart',
      bg: '#FC8019',
      icon: (
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6" aria-hidden>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
        </svg>
      ),
    },
    {
      name: 'BigBasket',
      href: 'https://www.bigbasket.com/',
      bg: '#84C225',
      icon: (
        <span className="text-xl font-black tracking-tighter leading-none">
          <span className="text-[#E21818]">b</span>
          <span className="text-black">b</span>
        </span>
      ),
    },
    {
      name: 'Amazon',
      href: platforms.amazon,
      bg: '#FFFFFF',
      icon: (
        <svg viewBox="0 0 100 100" className="w-10 h-10" aria-hidden>
          <text x="50" y="53" textAnchor="middle" fontSize="48" fontWeight="bold" fontFamily="sans-serif" fill="#111827">a</text>
          <path d="M26 66 C45 77 65 74 74 65" fill="none" stroke="#FF9900" strokeWidth="5" strokeLinecap="round" />
          <path d="M71 63 L76 65 L73 70" fill="#FF9900" />
        </svg>
      ),
    },
    {
      name: 'Flipkart',
      href: platforms.flipkart,
      bg: '#2874F0',
      icon: (
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden>
          <path d="M10 14 L30 14 L28 34 L12 34 Z" fill="#FFE500" />
          <path d="M16 14 C16 9 24 9 24 14" fill="none" stroke="#FFE500" strokeWidth="2.5" strokeLinecap="round" />
          <text x="20" y="27" textAnchor="middle" fontSize="13" fontWeight="bold" fontStyle="italic" fill="#2874F0">f</text>
        </svg>
      ),
    },
    {
      name: 'JioMart',
      href: 'https://www.jiomart.com/',
      bg: '#E4252A',
      icon: (
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden>
          <path d="M11 13 L29 13 L27 32 L13 32 Z" fill="#FFFFFF" />
          <path d="M16 13 C16 9 24 9 24 13" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <text x="20" y="25" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#E4252A">Jio</text>
        </svg>
      ),
    },
  ];
}

const subscribe = () => () => {};

// How long the "Redirecting..." view stays up before the store tab opens.
const REDIRECT_DELAY_MS = 1300;

interface BuyNowModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  platforms: Product['platforms'];
}

export default function BuyNowModal({ open, onClose, productName, platforms }: BuyNowModalProps) {
  const stores = getStores(platforms);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Stay mounted after `open` flips false until the exit animation ends.
  const [rendered, setRendered] = useState(open);
  if (open && !rendered) setRendered(true);

  const [redirectingStore, setRedirectingStore] = useState<Store | null>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToStore = (store: Store) => {
    if (redirectingStore) return; // ignore double clicks mid-redirect
    setRedirectingStore(store);
    redirectTimer.current = setTimeout(() => {
      window.open(store.href, '_blank', 'noopener,noreferrer');
      onClose();
    }, REDIRECT_DELAY_MS);
  };

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  // Closing mid-redirect (Escape, backdrop, X) cancels the pending tab open.
  // The view itself resets in onAnimationEnd below, once `rendered` unmounts
  // the panel — not here, to avoid a setState-in-effect cascade.
  useEffect(() => {
    if (open || !redirectTimer.current) return;
    clearTimeout(redirectTimer.current);
  }, [open]);

  useEffect(() => () => {
    if (redirectTimer.current) clearTimeout(redirectTimer.current);
  }, []);

  if (!mounted || !rendered) return null;
  const state = open ? 'open' : 'closed';

  return createPortal(
    <div
      data-state={state}
      className="modal-backdrop fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
      onAnimationEnd={(e) => {
        if (!open && e.target === e.currentTarget) {
          setRendered(false);
          setRedirectingStore(null);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="buy-modal-title"
        data-state={state}
        onClick={(e) => e.stopPropagation()}
        className="modal-panel relative w-full sm:max-w-[520px] rounded-t-2xl sm:rounded-2xl p-6 sm:p-9 shadow-[0_30px_80px_-20px_rgba(9,5,3,0.6)] overflow-hidden"
        style={{ background: 'var(--bg-light)', color: 'var(--text-on-light)' }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[rgba(29,15,9,0.08)]"
        >
          <X size={20} />
        </button>

        {redirectingStore ? (
          <div key="redirecting" className="image-swap flex flex-col items-center text-center py-10 sm:py-14">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
              <span
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  border: '3px solid rgba(29,15,9,0.12)',
                  borderTopColor: 'var(--accent-on-light)',
                }}
                aria-hidden
              />
              <span
                className="absolute inset-[10px] rounded-full flex items-center justify-center animate-pulse"
                style={{ background: redirectingStore.bg }}
              >
                {redirectingStore.icon}
              </span>
            </div>

            <p className="mt-7 text-lg font-medium" style={{ color: 'var(--text-on-light)' }}>
              Redirecting to {redirectingStore.name}…
            </p>
            <p className="mt-1.5 text-[14px]" style={{ color: 'var(--text-on-light-muted)' }}>
              Opening in a new tab
            </p>
          </div>
        ) : (
          <div key="stores" className="image-swap">
            <p className="text-[12px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-on-light)' }}>
              Buy now
            </p>
            <h2 id="buy-modal-title" className="mt-2 pr-10 text-2xl sm:text-[28px] leading-tight font-medium">
              {productName}
            </h2>
            <p className="mt-2 text-[15px]" style={{ color: 'var(--text-on-light-muted)' }}>
              Choose your preferred store.
            </p>

            {/* Two explicit flex rows (4 then 3, bottom row centered) rather
                than flex-wrap: wrap's break point depends on container width,
                which can't guarantee the same 4-then-3 split at every
                viewport size the way two fixed rows can. */}
            <div className="mt-7 flex flex-col gap-y-5">
              {[stores.slice(0, 4), stores.slice(4, 7)].map((row, rowIndex) => (
                <ul key={rowIndex} className="flex justify-center gap-x-4 sm:gap-x-5">
                  {row.map((store, i) => (
                    <li key={store.name} className="w-14 sm:w-16 panel-in" style={{ animationDelay: `${80 + (rowIndex * 4 + i) * 40}ms` }}>
                      <button
                        type="button"
                        onClick={() => goToStore(store)}
                        className="group flex flex-col items-center gap-2 text-center w-full cursor-pointer"
                      >
                        <span
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border border-[rgba(29,15,9,0.1)] shadow-[0_6px_16px_-8px_rgba(29,15,9,0.4)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-105"
                          style={{ background: store.bg }}
                        >
                          {store.icon}
                        </span>
                        <span className="text-[13px] font-medium leading-tight">{store.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            <p className="mt-7 pt-5 border-t text-[13px] text-center" style={{ borderColor: 'var(--border-on-light)', color: 'var(--text-on-light-muted)' }}>
              Also available at select supermarkets near you.
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
