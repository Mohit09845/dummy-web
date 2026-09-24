'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface BuyNowModalProps {
  onClose: () => void;
  productName?: string;
  platforms?: {
    blinkit?: string;
    amazon?: string;
    flipkart?: string;
  };
}

export default function BuyNowModal({ onClose, productName, platforms }: BuyNowModalProps) {
  const blinkitUrl = platforms?.blinkit || 'https://blinkit.com/';
  const amazonUrl = platforms?.amazon || 'https://www.amazon.in/';
  const flipkartUrl = platforms?.flipkart || 'https://www.flipkart.com/';

  return (
    <AnimatePresence>
      {/* ── Dark Backdrop ────────────────────────────────────────── */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* ── Modal Card (Golden Yellow Background) ───────────────── */}
        <motion.div
          key="modal-card"
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="relative w-full max-w-[370px] sm:max-w-[420px] rounded-[32px] p-7 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.65)] select-none"
          style={{ backgroundColor: '#F5C254' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-black hover:opacity-70 active:scale-90 transition-all cursor-pointer p-1"
          >
            <X size={26} strokeWidth={2.5} />
          </button>

          {/* Modal Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight font-display">
              Buy Now
            </h2>
            {productName && (
              <p className="text-sm sm:text-base font-semibold text-black/70 mt-1">{productName}</p>
            )}
          </div>

          {/* ── Row 1 of Platform Icons (4 circular buttons) ───────── */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
            {/* 1. Blinkit */}
            <a
              href={blinkitUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Blinkit"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFCE00] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer p-2 shrink-0 border border-black/10"
            >
              <Image
                src="/assets/logos/blinkit.webp"
                alt="Blinkit"
                width={42}
                height={42}
                className="object-contain"
                unoptimized
              />
            </a>

            {/* 2. Zepto */}
            <a
              href="https://www.zeptonow.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Zepto"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#2E004B] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer shrink-0 border border-black/10"
            >
              <span className="font-extrabold text-white text-xs sm:text-sm tracking-tight">
                zepto
              </span>
            </a>

            {/* 3. BigBasket (bb) */}
            <a
              href="https://www.bigbasket.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="BigBasket"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#84C225] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer shrink-0 border border-black/10"
            >
              <span className="font-black text-lg sm:text-xl tracking-tighter flex items-center leading-none">
                <span className="text-[#E21818]">b</span>
                <span className="text-black">b</span>
              </span>
            </a>

            {/* 4. Swiggy Instamart */}
            <a
              href="https://www.swiggy.com/instamart"
              target="_blank"
              rel="noopener noreferrer"
              title="Swiggy Instamart"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FC8019] flex flex-col items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer p-1 shrink-0 border border-black/10"
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 sm:w-6 sm:h-6">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-[7px] sm:text-[8px] font-black tracking-wider text-white leading-none mt-0.5">
                SWIGGY
              </span>
            </a>
          </div>

          {/* ── Row 2 of Platform Icons (3 circular buttons) ───────── */}
          <div className="flex items-center justify-center gap-4 sm:gap-5 mb-7">
            {/* 5. Amazon */}
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Amazon"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer p-2 shrink-0 border border-black/10"
            >
              <svg viewBox="0 0 100 100" className="w-10 h-10">
                <text
                  x="50"
                  y="53"
                  textAnchor="middle"
                  fontSize="48"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  fill="#111827"
                >
                  a
                </text>
                <path
                  d="M26 66 C45 77 65 74 74 65"
                  fill="none"
                  stroke="#FF9900"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path d="M71 63 L76 65 L73 70" fill="#FF9900" />
              </svg>
            </a>

            {/* 6. Flipkart */}
            <a
              href={flipkartUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Flipkart"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#2874F0] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer p-2.5 shrink-0 border border-black/10"
            >
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <path d="M10 14 L30 14 L28 34 L12 34 Z" fill="#FFE500" />
                <path
                  d="M16 14 C16 9 24 9 24 14"
                  fill="none"
                  stroke="#FFE500"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="20"
                  y="27"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fontStyle="italic"
                  fill="#2874F0"
                >
                  f
                </text>
              </svg>
            </a>

            {/* 7. JioMart */}
            <a
              href="https://www.jiomart.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="JioMart"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E4252A] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer p-2 shrink-0 border border-black/10"
            >
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <path d="M11 13 L29 13 L27 32 L13 32 Z" fill="#FFFFFF" />
                <path
                  d="M16 13 C16 9 24 9 24 13"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="20"
                  y="25"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="bold"
                  fill="#E4252A"
                >
                  Jio
                </text>
              </svg>
            </a>
          </div>

          {/* Bottom text */}
          <p className="text-sm sm:text-base font-semibold text-black/90 text-center leading-snug max-w-[240px] sm:max-w-xs mx-auto">
            This product is now available at your nearby stores
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
