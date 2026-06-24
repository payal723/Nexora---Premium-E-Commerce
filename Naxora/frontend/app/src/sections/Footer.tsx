import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Linkedin, CreditCard, Smartphone, Banknote } from 'lucide-react';

const footerLinks = {
  Shop: ['All Products', 'Electronics', 'Clothing', 'Home & Living', 'Accessories'],
  Support: ['FAQ', 'Shipping Info', 'Returns', 'Track Order', 'Contact Us'],
  Company: ['About Us', 'Careers', 'Press', 'Blog', 'Affiliates'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'],
};

const socialLinks = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Linkedin, label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#12121a] border-t border-[#2a2a3a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-medium text-[#f8f9fa]">
                Nex<span className="text-[#6c5ce7]">ora</span>
              </span>
            </Link>
            <p className="text-sm text-[#a0a0b0] mb-6 max-w-xs">
              Where Style Meets Trust. Your premium destination for curated products.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-[#1a1a25] flex items-center justify-center text-[#a0a0b0] hover:text-[#a29bfe] hover:bg-[#2a2a3a] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-medium text-[#f8f9fa] mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      to="/shop"
                      className="text-sm text-[#a0a0b0] hover:text-[#a29bfe] transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2a2a3a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6c6c7e]">
            © 2026 Nexora. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[#6c6c7e]">
            <CreditCard size={20} />
            <Smartphone size={20} />
            <Banknote size={20} />
            <span className="text-xs">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
