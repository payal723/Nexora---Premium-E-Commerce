import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/data/products';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-card',
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.1,
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

  const goNext = () => setActive((prev) => (prev + 1) % testimonials.length);
  const goPrev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={sectionRef} className="relative z-10 py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-normal text-[#f8f9fa] mb-10 tracking-tight text-center">
          What Our Customers Say
        </h2>

        {/* Desktop: Show 3 cards */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t) => (
            <div
              key={t.id}
              className="testimonial-card bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6 opacity-0"
            >
              <Quote size={28} className="text-[#6c5ce7] mb-4" />
              <p className="text-[#f8f9fa] italic leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-[#00cec9] fill-[#00cec9]" />
                ))}
              </div>
              <div>
                <p className="text-sm font-medium text-[#f8f9fa]">{t.author}</p>
                <p className="text-xs text-[#a0a0b0]">{t.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="testimonial-card bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6 opacity-0">
            <Quote size={28} className="text-[#6c5ce7] mb-4" />
            <p className="text-[#f8f9fa] italic leading-relaxed mb-6">
              "{testimonials[active].quote}"
            </p>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(testimonials[active].rating)].map((_, i) => (
                <Star key={i} size={14} className="text-[#00cec9] fill-[#00cec9]" />
              ))}
            </div>
            <div>
              <p className="text-sm font-medium text-[#f8f9fa]">{testimonials[active].author}</p>
              <p className="text-xs text-[#a0a0b0]">{testimonials[active].location}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full border border-[#2a2a3a] flex items-center justify-center text-[#a0a0b0] hover:text-[#f8f9fa] hover:border-[#6c5ce7] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === active ? 'bg-[#6c5ce7]' : 'bg-[#2a2a3a]'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={goNext}
              className="w-10 h-10 rounded-full border border-[#2a2a3a] flex items-center justify-center text-[#a0a0b0] hover:text-[#f8f9fa] hover:border-[#6c5ce7] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
