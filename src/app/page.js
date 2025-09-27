"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

export default function HomePage() {
  const [quote, setQuote] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      // Fetch the quote
      const res = await fetch('/api/quote');
      const data = await res.json();
      const [quoteText, author] = `${data[0].q}||${data[0].a}`.split('||');
      setQuote(`${quoteText}||${author}`);

      // Fetch the author image
      const imgRes = await fetch(`/api/quote-image?author=${encodeURIComponent(author)}`);
      const imgData = await imgRes.json();

      if (imgData.imageUrl) {
        setBackgroundImage(imgData.imageUrl);
      } else {
        setBackgroundImage(null);
      }
    } catch (error) {
      setQuote('Failed to fetch quote. Please try again.');
      setBackgroundImage(null);
    }
    setLoading(false);
  };



  return (
    <div id="quote-container" className="relative flex flex-col items-center justify-center min-h-screen p-8 font-sans overflow-hidden">
      {/* Background Image as <img> for html2canvas */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          crossOrigin="anonymous"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Text and buttons */}
      <div className="relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {quote && (
            <motion.div
              key={quote}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mb-8"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-snug">
                "{quote.split("||")[0]}"
              </h1>
              <p className="text-xl text-gray-300">— {quote.split('||')[1]}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4">
          <button
            onClick={fetchQuote}
            className="px-10 py-4 bg-yellow-500 text-gray-900 font-bold rounded-full hover:bg-yellow-400 shadow-lg transition-transform transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>

        </div>
      </div>
    </div>
  );
}