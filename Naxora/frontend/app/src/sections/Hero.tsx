import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.2
        )
        .fromTo(
          subheadlineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.4
        )
        .fromTo(
          buttonsRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          0.6
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <p
          ref={eyebrowRef}
          className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#a0a0b0] mb-6 opacity-0"
        >
          Premium Shopping Experience
        </p>

        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#f8f9fa] leading-[1.1] tracking-tight mb-6 opacity-0"
        >
          Discover Products That{' '}
          <span className="text-[#a29bfe]">Define Your Style</span>
        </h1>

        <p
          ref={subheadlineRef}
          className="text-base sm:text-lg text-[#a0a0b0] max-w-xl mx-auto mb-10 leading-relaxed opacity-0"
        >
          Curated collection of premium products with secure checkout and fast delivery
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center opacity-0">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#6c5ce7] text-white rounded-full font-medium text-sm hover:bg-[#a29bfe] transition-all duration-300 hover:shadow-[0_0_40px_rgba(108,92,231,0.3)]"
          >
            Shop Now
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#2a2a3a] text-[#f8f9fa] rounded-full font-medium text-sm hover:border-[#6c5ce7] hover:text-[#a29bfe] transition-all duration-300"
          >
            Explore Categories
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown size={24} className="text-[#6c6c7e]" />
      </div>
    </section>
  );
}
