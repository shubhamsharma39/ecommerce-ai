import React from 'react';
import { 
  ShoppingBag, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck,
  RotateCcw,
  Banknote,
  ChevronRight,
  Sparkles,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#111213] text-[#D1D5DB] text-xs pt-16 pb-10 mt-20 border-t-4 border-[#008060] relative overflow-hidden">
      
      {/* Decorative Glow Elements */}
      <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-[#008060]/10 blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-80 h-80 rounded-full bg-[#008060]/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Main 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#26282B]">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 text-2xl font-black text-white group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#008060] text-white shadow-md shadow-[#008060]/30 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="tracking-tight text-2xl font-black text-white">
                Shopify<span className="text-[#008060]">.</span>
              </span>
            </Link>
            
            <p className="text-[#9CA3AF] text-xs leading-relaxed max-w-sm pt-1">
              Your premier online shopping destination. Discover top smartphones, precision electronics, trending fashion, home essentials, and lifestyle gear with nationwide Cash on Delivery.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-[#D1D5DB]">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="h-3.5 w-3.5 text-[#008060] shrink-0" />
                <span>24x7 Customer Support: <strong>+91 1800 266 2255</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-[#008060] shrink-0" />
                <span>Email Support: <strong>help@shopify-store.local</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-[#008060] shrink-0" />
                <span>Express Fulfillment Hubs: Mumbai • Bengaluru • Delhi NCR</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold pt-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>FastAPI Backend & MongoDB Atlas Connected</span>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-[#26282B] pb-2">
              Explore Categories
            </h4>
            <ul className="space-y-2 text-[#9CA3AF]">
              <li><Link to="/shop?category=Mobiles" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> Mobiles & Tablets</Link></li>
              <li><Link to="/shop?category=Electronics" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> Electronics & Audio</Link></li>
              <li><Link to="/shop?category=Fashion" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> Fashion & Apparel</Link></li>
              <li><Link to="/shop?category=Home%20%26%20Kitchen" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> Home & Kitchen</Link></li>
              <li><Link to="/shop?category=Beauty%20%26%20Personal%20Care" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> Beauty & Personal Care</Link></li>
              <li><Link to="/shop?category=Books%20%26%20Stationery" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> Books & Stationery</Link></li>
              <li><Link to="/shop?category=Sports%20%26%20Fitness" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> Sports & Fitness</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> Accessories</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-[#26282B] pb-2">
              Customer Services
            </h4>
            <ul className="space-y-2 text-[#9CA3AF]">
              <li><Link to="/orders" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> Track My Order</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> View Shopping Cart</Link></li>
              <li><Link to="/checkout" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> Cash on Delivery (COD)</Link></li>
              <li><Link to="/shop" className="hover:text-emerald-400 transition flex items-center gap-1"><ChevronRight className="h-3 w-3 text-[#008060]" /> Shipping & Returns Policy</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-400 transition flex items-center gap-1 text-emerald-400 font-bold"><ChevronRight className="h-3 w-3 text-[#008060]" /> Admin Portal</Link></li>
            </ul>
          </div>

          {/* Column 4: Shopify Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-[#26282B] pb-2">
              Shopify Promise
            </h4>
            <ul className="space-y-2.5 text-[#9CA3AF]">
              <li className="flex items-start gap-2">
                <Banknote className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Cash on Delivery:</strong> Inspect your items and pay at your doorstep with cash or UPI.</span>
              </li>
              <li className="flex items-start gap-2">
                <Truck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Free Express Shipping:</strong> Auto-applied on all qualifying orders over $50.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span><strong>100% Genuine Inspected:</strong> Rigorous quality inspection on every shipment.</span>
              </li>
              <li className="flex items-start gap-2">
                <RotateCcw className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>30-Day Hassle-Free Returns:</strong> Instant replacements and dedicated refund support.</span>
              </li>
            </ul>

            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-[#1E2023] border border-[#26282B] text-[10px] text-emerald-400 font-semibold">
                College Capstone Project Submission
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#008060]" />
            <span>© {new Date().getFullYear()} Shopify E-Commerce Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#9CA3AF]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Secure 256-bit Encrypted
            </span>
            <span className="flex items-center gap-1 text-[#9CA3AF]">
              Crafted with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for Academic Evaluation
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
