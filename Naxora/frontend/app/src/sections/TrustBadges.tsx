import { useEffect, useRef } from 'react';
import { Truck, CreditCard, RotateCcw, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const badges = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'On orders above ₹500',
  },
  {
    icon: CreditCard,
    title: 'Cash on Delivery',
    description: 'Pay when you receive',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '7-day return policy',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    description: '256-bit SSL encryption',
  },
];

export default function TrustBadges() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.badge-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
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

  return (
    <section ref={sectionRef} className="relative z-10 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#12121a]/60 backdrop-blur-lg rounded-2xl border border-[#2a2a3a] p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge) => (
              <div
                key={badge.title}
                className="badge-item flex items-center gap-4 opacity-0"
              >
                <div className="w-12 h-12 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center shrink-0">
                  <badge.icon size={22} className="text-[#6c5ce7]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#f8f9fa]">{badge.title}</h4>
                  <p className="text-xs text-[#a0a0b0] mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
