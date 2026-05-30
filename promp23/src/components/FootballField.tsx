import React from 'react';

const FootballField: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-8 left-8 w-36 h-18 bg-white rounded-full blur-xl" />
        <div className="absolute top-16 right-16 w-52 h-22 bg-white rounded-full blur-xl" />
        <div className="absolute top-4 left-1/3 w-44 h-16 bg-white rounded-full blur-xl" />
        <div className="absolute top-24 left-1/2 w-40 h-18 bg-white rounded-full blur-xl" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[75%]">
        <div
          className="absolute inset-0 bg-gradient-to-b from-green-400 via-green-500 to-green-600"
          style={{
            clipPath: 'polygon(0% 100%, 20% 15%, 80% 15%, 100% 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 8%,
                rgba(0, 100, 0, 0.2) 8%,
                rgba(0, 100, 0, 0.2) 16%
              )`,
            }}
          />

          <svg
            className="absolute inset-0 w-full h-full text-white opacity-90"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <line x1="50" y1="15" x2="50" y2="100" stroke="currentColor" strokeWidth="0.25" />
            <ellipse cx="50" cy="50" rx="12" ry="8" fill="none" stroke="currentColor" strokeWidth="0.25" />
            <line x1="42" y1="18" x2="58" y2="18" stroke="currentColor" strokeWidth="0.25" />
            <line x1="42" y1="18" x2="42" y2="28" stroke="currentColor" strokeWidth="0.25" />
            <line x1="58" y1="18" x2="58" y2="28" stroke="currentColor" strokeWidth="0.25" />
            <line x1="42" y1="28" x2="58" y2="28" stroke="currentColor" strokeWidth="0.25" />
            <line x1="35" y1="18" x2="65" y2="18" stroke="currentColor" strokeWidth="0.25" />
            <line x1="35" y1="18" x2="35" y2="38" stroke="currentColor" strokeWidth="0.25" />
            <line x1="65" y1="18" x2="65" y2="38" stroke="currentColor" strokeWidth="0.25" />
            <line x1="35" y1="38" x2="65" y2="38" stroke="currentColor" strokeWidth="0.25" />
            <rect x="38" y="72" width="24" height="5" fill="none" stroke="currentColor" strokeWidth="0.25" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-[48%] left-1/2 -translate-x-1/2 w-56 md:w-72 z-10">
        <div className="relative z-10 h-24 md:h-30">
          <div className="absolute -inset-4 bg-black/15 blur-xl rounded-full" />
          
          <div className="relative h-full flex flex-col">
            <div className="absolute top-0 left-0 right-0 flex justify-center">
              <div className="w-48 md:w-64 h-2 bg-gradient-to-r from-gray-200 via-white to-gray-200 rounded-full shadow-xl" />
            </div>
            
            <div className="absolute top-0 left-0 h-full">
              <div className="w-2 h-full bg-gradient-to-r from-gray-200 to-white rounded-l-lg shadow-xl" />
            </div>
            
            <div className="absolute top-0 right-0 h-full">
              <div className="w-2 h-full bg-gradient-to-l from-gray-200 to-white rounded-r-lg shadow-xl" />
            </div>

            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-44 md:w-60 h-[calc(100%-8px)] overflow-hidden z-5">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: '8px 8px',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[52%] left-1/2 -translate-x-1/2 w-full h-4">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 md:w-64 h-1.5 bg-white/70 rounded-full shadow-inner" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

export default FootballField;
