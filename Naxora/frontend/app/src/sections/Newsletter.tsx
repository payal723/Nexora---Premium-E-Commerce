import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

export default function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.newsletter-content',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thanks for subscribing!');
      setEmail('');
    }
  };

  return (
    <section ref={sectionRef} className="relative z-10 py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-xl mx-auto text-center newsletter-content opacity-0">
        <h2 className="text-3xl sm:text-4xl font-normal text-[#f8f9fa] mb-3 tracking-tight">
          Stay in the Loop
        </h2>
        <p className="text-[#a0a0b0] mb-8">
          Subscribe for exclusive deals and new arrivals
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full h-14 pl-6 pr-36 bg-[#12121a] border border-[#2a2a3a] rounded-full text-[#f8f9fa] placeholder:text-[#6c6c7e] focus:outline-none focus:border-[#6c5ce7] transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-[#6c5ce7] text-white rounded-full text-sm font-medium flex items-center gap-2 hover:bg-[#a29bfe] transition-colors"
          >
            Subscribe
            <Send size={14} />
          </button>
        </form>
      </div>
    </section>
  );
}
