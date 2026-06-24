import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 35, seconds: 42 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

export default function OfferBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const timeLeft = useCountdown();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.offer-content',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-20 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-gradient-to-r from-[#1a1a25] to-[#12121a] rounded-3xl border border-[#2a2a3a] p-10 sm:p-16 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#fd79a8]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6c5ce7]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="offer-content relative z-10 text-center opacity-0">
            <span className="inline-block px-4 py-1.5 bg-[#fd79a8]/10 text-[#fd79a8] text-xs font-medium rounded-full mb-4">
              Limited Time Offer
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal text-[#f8f9fa] mb-4 tracking-tight">
              Summer Sale — Up to <span className="text-[#fd79a8]">50% Off</span>
            </h2>
            <p className="text-[#a0a0b0] mb-8 max-w-lg mx-auto">
              Limited time offer on selected premium products. Grab your favorites before they're gone!
            </p>

            {/* Countdown */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-10">
              {timeBlocks.map((block) => (
                <div
                  key={block.label}
                  className="w-20 sm:w-24 bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-3 sm:p-4"
                >
                  <div className="text-2xl sm:text-3xl font-medium text-[#f8f9fa]">
                    {String(block.value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#6c6c7e] uppercase tracking-wider mt-1">
                    {block.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#fd79a8] text-white rounded-full font-medium text-sm hover:bg-[#fd79a8]/90 transition-all duration-300 hover:shadow-[0_0_40px_rgba(253,121,168,0.3)]"
            >
              Shop the Sale
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
