import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { productsApi, cartApi } from '@/api/services';
import { formatCurrency } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { 
  ShoppingBag, 
  CheckCircle2, 
  ChevronRight,
  ChevronLeft,
  Truck,
  ShieldCheck,
  Banknote,
  RotateCcw,
  Sparkles,
  Smartphone,
  Watch,
  Headphones,
  Laptop,
  Shirt,
  Sparkle,
  Star,
  ArrowRight,
  Flame,
  Send,
  Zap,
  Tag
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  stock: number;
  category: string;
  is_active: boolean;
  rating?: number;
  reviewCount?: number;
  brand?: string;
  originalPrice?: number;
}

// 8 Target Categories with high quality representative visuals
const FEATURED_CATEGORIES = [
  { name: 'Mobiles', icon: Smartphone, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300', count: '14 Items', path: '/shop?category=Mobiles' },
  { name: 'Electronics', icon: Laptop, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', count: '28 Items', path: '/shop?category=Electronics' },
  { name: 'Fashion', icon: Shirt, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300', count: '22 Items', path: '/shop?category=Fashion' },
  { name: 'Home & Kitchen', icon: Sparkles, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300', count: '16 Items', path: '/shop?category=Home%20%26%20Kitchen' },
  { name: 'Beauty & Personal Care', icon: Sparkle, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300', count: '12 Items', path: '/shop?category=Beauty%20%26%20Personal%20Care' },
  { name: 'Books & Stationery', icon: Tag, iconName: 'Book', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', count: '19 Items', path: '/shop?category=Books%20%26%20Stationery' },
  { name: 'Sports & Fitness', icon: Watch, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300', count: '15 Items', path: '/shop?category=Sports%20%26%20Fitness' },
  { name: 'Accessories', icon: Headphones, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300', count: '20 Items', path: '/shop?category=Accessories' },
];

// Rich fallback products across all categories
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Apple iPhone 15 Pro Max (256GB)',
    description: 'Forged in titanium with A17 Pro chip, 48MP camera system, and USB-C superfast connectivity.',
    price: 1199.00,
    originalPrice: 1299.00,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
    stock: 14,
    category: 'Mobiles',
    brand: 'Apple',
    is_active: true,
    rating: 4.9,
    reviewCount: 384
  },
  {
    id: 'prod-2',
    name: 'Samsung Galaxy S24 Ultra (512GB)',
    description: 'Galaxy AI smartphone with 200MP camera, built-in S-Pen, and titanium armor frame.',
    price: 1249.00,
    originalPrice: 1399.00,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
    stock: 18,
    category: 'Mobiles',
    brand: 'Samsung',
    is_active: true,
    rating: 4.8,
    reviewCount: 240
  },
  {
    id: 'prod-3',
    name: 'Sony WH-1000XM5 Noise-Canceling Headphones',
    description: 'Industry-leading noise cancellation with 30hr battery and crystal clear spatial audio.',
    price: 349.99,
    originalPrice: 399.99,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    stock: 25,
    category: 'Electronics',
    brand: 'Sony',
    is_active: true,
    rating: 4.9,
    reviewCount: 420
  },
  {
    id: 'prod-4',
    name: 'MacBook Air 15" M3 (16GB RAM)',
    description: 'Strikingly thin design with blazing-fast Apple M3 chip, Liquid Retina display, and 18-hour battery.',
    price: 1299.00,
    originalPrice: 1499.00,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
    stock: 9,
    category: 'Electronics',
    brand: 'Apple',
    is_active: true,
    rating: 4.9,
    reviewCount: 195
  },
  {
    id: 'prod-5',
    name: 'Classic Tailored Wool Blazer',
    description: 'Premium Italian wool blend blazer with slim silhouette and satin interior lining.',
    price: 185.00,
    originalPrice: 240.00,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',
    stock: 22,
    category: 'Fashion',
    brand: 'Shopify Atelier',
    is_active: true,
    rating: 4.7,
    reviewCount: 88
  },
  {
    id: 'prod-6',
    name: 'Heavyweight Fleece Minimalist Hoodie',
    description: 'Ultra-soft 450gsm organic combed cotton hoodie with reinforced kangaroo pocket.',
    price: 78.00,
    originalPrice: 95.00,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600',
    stock: 35,
    category: 'Fashion',
    brand: 'Urban Thread',
    is_active: true,
    rating: 4.8,
    reviewCount: 132
  },
  {
    id: 'prod-7',
    name: 'Artisan Ceramic Pour-Over Dripper Set',
    description: 'Handcrafted stoneware dripper with heat-resistant borosilicate glass server and 40 filters.',
    price: 54.00,
    originalPrice: 68.00,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600',
    stock: 16,
    category: 'Home & Kitchen',
    brand: 'Kanso Craft',
    is_active: true,
    rating: 4.8,
    reviewCount: 76
  },
  {
    id: 'prod-8',
    name: 'Cast Iron Dutch Oven 6-Quart',
    description: 'Heavy-duty enameled cast iron Dutch oven providing flawless heat retention and even cooking.',
    price: 89.50,
    originalPrice: 115.00,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1584990347449-399066664e1c?w=600',
    stock: 12,
    category: 'Home & Kitchen',
    brand: 'Culinary Pro',
    is_active: true,
    rating: 4.9,
    reviewCount: 114
  },
  {
    id: 'prod-9',
    name: 'Hydrating Botanical Facial Serum',
    description: 'Infused with hyaluronic acid, organic green tea extract, and vitamin C for radiant skin.',
    price: 36.00,
    originalPrice: 48.00,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
    stock: 45,
    category: 'Beauty & Personal Care',
    brand: 'Glow Essentials',
    is_active: true,
    rating: 4.7,
    reviewCount: 92
  },
  {
    id: 'prod-10',
    name: 'Hardcover Productivity & Habit Planner',
    description: 'Undated 12-month goal setting and daily habit tracker bound in vegan pebble leather.',
    price: 24.50,
    originalPrice: 32.00,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    stock: 60,
    category: 'Books & Stationery',
    brand: 'PaperLab',
    is_active: true,
    rating: 4.8,
    reviewCount: 145
  },
  {
    id: 'prod-11',
    name: 'Smart Hybrid GPS Fitness Tracker',
    description: 'Precision heart rate, blood oxygen, and workout GPS telemetry with a 14-day battery life.',
    price: 149.00,
    originalPrice: 189.00,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    stock: 20,
    category: 'Sports & Fitness',
    brand: 'FitPulse',
    is_active: true,
    rating: 4.9,
    reviewCount: 178
  },
  {
    id: 'prod-12',
    name: 'Waterproof Commuter Laptop Backpack',
    description: 'Ergonomic 24L backpack with padded 16-inch laptop pocket and USB external pass-through.',
    price: 85.00,
    originalPrice: 110.00,
    currency: 'usd',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    stock: 28,
    category: 'Accessories',
    brand: 'AeroPack',
    is_active: true,
    rating: 4.8,
    reviewCount: 89
  }
];

export const HomePage: React.FC<{ searchQuery?: string; onCartUpdated?: () => void }> = ({ onCartUpdated }) => {
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: serverProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts(),
    retry: 1
  });

  // Use real backend products if available, with rich fallbacks
  const products = serverProducts.length > 0 ? serverProducts : DEFAULT_PRODUCTS;

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!isAuthenticated) return null;
      return cartApi.addItem(productId, 1);
    },
    onSuccess: (_, productId) => {
      setAddedProductId(productId);
      setTimeout(() => setAddedProductId(null), 2000);
      if (onCartUpdated) onCartUpdated();
    }
  });

  // Promotional Hero Slides
  const heroSlides = [
    {
      badge: 'Shopify Big Festive Sale',
      title: 'FLAGSHIP SMARTPHONES & WEARABLES',
      subtitle: 'UP TO 50% OFF',
      description: 'Discover titanium smartphones, precision noise-canceling audio, and smart health trackers with instant Cash on Delivery.',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      ctaText: 'Explore Smartphones',
      ctaLink: '/shop?category=Mobiles',
      bgGradient: 'from-[#004C3F] via-[#008060] to-[#002E25]'
    },
    {
      badge: 'Autumn & Winter Capsule',
      title: 'MODERN FASHION & LIFESTYLE',
      subtitle: 'FLAT 40% OFF NEW ARRIVALS',
      description: 'Elevate your everyday wardrobe with tailored outerwear, heavyweight cotton essentials, and premium leather accessories.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
      ctaText: 'Shop Fashion',
      ctaLink: '/shop?category=Fashion',
      bgGradient: 'from-[#1A1A1A] via-[#2D3136] to-[#111213]'
    },
    {
      badge: 'Zero Risk Shopping Experience',
      title: 'DOORSTEP CASH ON DELIVERY',
      subtitle: 'FREE SHIPPING ON ORDERS $50+',
      description: 'Shop with 100% confidence. Inspect your package at delivery and pay securely with cash or UPI at your doorstep.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      ctaText: 'Browse All Offers',
      ctaLink: '/shop',
      bgGradient: 'from-[#0F2D37] via-[#155E75] to-[#0E3A45]'
    }
  ];

  // Auto carousel slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 4000);
    }
  };

  // Sliced Sections from backend data
  const trendingProducts = products.slice(0, 6);
  const bestSellers = products.slice(2, 8);
  const electronicsDeals = products.filter(p => p.category.toLowerCase().includes('electronic') || p.category.toLowerCase().includes('mobile')).slice(0, 4);
  const fashionDeals = products.filter(p => p.category.toLowerCase().includes('fashion') || p.category.toLowerCase().includes('clothing') || p.category.toLowerCase().includes('access')).slice(0, 4);

  return (
    <div className="space-y-14 pb-20">
      
      {/* ── 1. Hero Promotional Banner Carousel ─────────────────────────── */}
      <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${heroSlides[currentSlide].bgGradient} text-white shadow-xl transition-all duration-700`}>
        {/* Glow ambient spots */}
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 w-80 h-80 rounded-full bg-black/20 blur-3xl pointer-events-none" />

        <div className="relative px-6 sm:px-12 lg:px-16 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[380px]">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>{heroSlides[currentSlide].badge}</span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
                  {heroSlides[currentSlide].subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  to={heroSlides[currentSlide].ctaLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#1A1A1A] font-extrabold text-xs sm:text-sm hover:bg-gray-100 transition shadow-lg hover:scale-102 active:scale-98"
                >
                  <ShoppingBag className="h-4 w-4 text-[#008060]" />
                  <span>{heroSlides[currentSlide].ctaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black/30 hover:bg-black/50 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
                >
                  <span>View All Deals</span>
                </Link>
              </div>

            </div>

            {/* Right Product Image Showcase */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-64 sm:w-80 aspect-square rounded-2xl overflow-hidden bg-white/10 border border-white/20 p-4 shadow-2xl backdrop-blur-xs flex items-center justify-center group">
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-[#008060] text-white font-black text-[11px] shadow-md flex items-center gap-1">
                  <Flame className="h-3 w-3 text-amber-300" />
                  HOT DEAL
                </span>
              </div>
            </div>

          </div>

          {/* Carousel Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center transition"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center transition"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dot Pagination */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-amber-300' : 'w-2 bg-white/30'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ── 2. Featured Category Grid (8 Categories) ─────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight section-heading-underline">
              Shop by <span className="text-[#008060]">Category</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">Select from our 8 verified shopping collections</p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#008060] hover:text-[#006E52] transition"
          >
            <span>Explore All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {FEATURED_CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.path}
              className="category-badge-card group flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-[#E1E3E5] shadow-2xs hover:border-[#008060] transition"
            >
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-gray-50 border-2 border-gray-100 group-hover:border-[#008060] transition mb-2">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <h4 className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#008060] transition line-clamp-1">
                {cat.name}
              </h4>
              <span className="text-[10px] text-gray-400 mt-0.5">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. Trending Products (Flipkart-style 6-Grid) ─────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight section-heading-underline">
              Trending <span className="text-[#008060]">Products</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">Top verified bestsellers with instant Cash on Delivery</p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#008060] hover:text-[#006E52] transition"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingProducts.map((product) => {
            const originalPrice = product.originalPrice || Math.round(product.price * 1.25);
            const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);

            return (
              <div
                key={product.id}
                className="product-card flex flex-col justify-between p-3.5 bg-white relative group"
              >
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-[#008060] text-white font-extrabold text-[10px] shadow-xs">
                  {discountPct}% OFF
                </div>

                {/* Product Image */}
                <Link to={`/products/${product.id}`} className="block relative aspect-square rounded-xl overflow-hidden bg-gray-50 p-3 mt-4 mb-2 flex items-center justify-center">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>

                {/* Info */}
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                  
                  <Link
                    to={`/products/${product.id}`}
                    className="block text-xs font-bold text-[#1A1A1A] hover:text-[#008060] transition line-clamp-2 leading-tight"
                  >
                    {product.name}
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 pt-0.5 text-amber-500 text-xs">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-[#1A1A1A] text-[11px]">{product.rating || 4.8}</span>
                    <span className="text-gray-400 text-[10px]">({product.reviewCount || 95})</span>
                  </div>

                  {/* Pricing */}
                  <div className="pt-1 space-y-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-[#1A1A1A]">
                        {formatCurrency(product.price, 'USD')}
                      </span>
                      <span className="text-[11px] text-gray-400 line-through">
                        {formatCurrency(originalPrice, 'USD')}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600">
                      Save {formatCurrency(originalPrice - product.price, 'USD')}
                    </p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-3">
                  <button
                    onClick={() => addToCartMutation.mutate(product.id)}
                    disabled={addToCartMutation.isPending && addedProductId === product.id}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      addedProductId === product.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#F0F7F5] hover:bg-[#008060] text-[#008060] hover:text-white border border-[#CBE2DA]'
                    }`}
                  >
                    {addedProductId === product.id ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. Promotional Banner Cards Strip ───────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Banner 1: Electronics */}
        <div className="rounded-3xl bg-gradient-to-br from-[#004C3F] to-[#008060] text-white p-6 sm:p-7 relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="space-y-2 z-10 max-w-[210px]">
            <span className="px-2.5 py-1 rounded-md bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
              ELECTRONICS EXTRAVAGANZA
            </span>
            <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">UP TO 50% OFF</h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Flagship smartphones, noise-canceling headsets & smart displays.
            </p>
          </div>
          <div className="pt-6 z-10">
            <Link
              to="/shop?category=Electronics"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#004C3F] font-black text-xs hover:bg-gray-100 transition shadow-xs"
            >
              <span>Explore Gear</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Headphones className="absolute -right-4 -bottom-4 h-36 w-36 text-white/10 pointer-events-none" />
        </div>

        {/* Banner 2: 100% Cash on Delivery */}
        <div className="rounded-3xl bg-gradient-to-br from-[#111213] to-[#26282B] text-white p-6 sm:p-7 relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="space-y-2 z-10 max-w-[210px]">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
              100% VERIFIED COD
            </span>
            <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">CASH ON DELIVERY</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Zero advance payment needed. Pay upon delivery via cash or UPI.
            </p>
          </div>
          <div className="pt-6 z-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008060] text-white font-black text-xs hover:bg-[#006E52] transition shadow-xs"
            >
              <span>Shop with COD</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Banknote className="absolute -right-4 -bottom-4 h-36 w-36 text-white/10 pointer-events-none" />
        </div>

        {/* Banner 3: Free Express Shipping */}
        <div className="rounded-3xl bg-gradient-to-br from-[#B45309] to-[#F59E0B] text-white p-6 sm:p-7 relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="space-y-2 z-10 max-w-[210px]">
            <span className="px-2.5 py-1 rounded-md bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
              FAST DISPATCH
            </span>
            <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">FREE SHIPPING $50+</h3>
            <p className="text-xs text-amber-100 leading-relaxed">
              Complimentary expedited nationwide shipping on all qualifying carts.
            </p>
          </div>
          <div className="pt-6 z-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#B45309] font-black text-xs hover:bg-gray-100 transition shadow-xs"
            >
              <span>Unlock Free Shipping</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Truck className="absolute -right-4 -bottom-4 h-36 w-36 text-white/10 pointer-events-none" />
        </div>

      </section>

      {/* ── 5. Electronics & Mobiles Spotlight ──────────────────────────── */}
      {electronicsDeals.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight section-heading-underline">
                Electronics & <span className="text-[#008060]">Smart Gadgets</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">Next-gen performance with manufacturer warranty</p>
            </div>
            <Link
              to="/shop?category=Electronics"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#008060] hover:text-[#006E52] transition"
            >
              <span>View All Electronics</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {electronicsDeals.map((product) => {
              const originalPrice = product.originalPrice || Math.round(product.price * 1.2);
              return (
                <div
                  key={`elec-${product.id}`}
                  className="product-card flex flex-col justify-between p-4 bg-white relative group"
                >
                  <div className="space-y-3">
                    <Link to={`/products/${product.id}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-gray-50 p-4 flex items-center justify-center">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white text-[10px] font-bold text-[#1A1A1A] border border-gray-200 shadow-2xs">
                        {product.brand || product.category}
                      </span>
                    </Link>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-[#1A1A1A] text-[11px]">{product.rating || 4.9}</span>
                        <span className="text-gray-400 text-[10px]">({product.reviewCount || 112})</span>
                      </div>

                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-bold text-xs sm:text-sm text-[#1A1A1A] line-clamp-1 hover:text-[#008060] transition">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-base font-black text-[#1A1A1A]">
                          {formatCurrency(product.price, 'USD')}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(originalPrice, 'USD')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => addToCartMutation.mutate(product.id)}
                      disabled={addToCartMutation.isPending && addedProductId === product.id}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        addedProductId === product.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#008060] hover:bg-[#006E52] text-white shadow-xs'
                      }`}
                    >
                      {addedProductId === product.id ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 6. Fashion & Lifestyle Collection ───────────────────────────── */}
      {fashionDeals.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight section-heading-underline">
                Fashion & <span className="text-[#008060]">Lifestyle</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">Trendy wardrobe essentials, footwear and travel accessories</p>
            </div>
            <Link
              to="/shop?category=Fashion"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#008060] hover:text-[#006E52] transition"
            >
              <span>View All Fashion</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {fashionDeals.map((product) => {
              const originalPrice = product.originalPrice || Math.round(product.price * 1.25);
              return (
                <div
                  key={`fash-${product.id}`}
                  className="product-card flex flex-col justify-between p-4 bg-white relative group"
                >
                  <div className="space-y-3">
                    <Link to={`/products/${product.id}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-gray-50 p-4 flex items-center justify-center">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white text-[10px] font-bold text-[#1A1A1A] border border-gray-200 shadow-2xs">
                        {product.category}
                      </span>
                    </Link>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-[#1A1A1A] text-[11px]">{product.rating || 4.8}</span>
                        <span className="text-gray-400 text-[10px]">({product.reviewCount || 74})</span>
                      </div>

                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-bold text-xs sm:text-sm text-[#1A1A1A] line-clamp-1 hover:text-[#008060] transition">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-base font-black text-[#1A1A1A]">
                          {formatCurrency(product.price, 'USD')}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(originalPrice, 'USD')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => addToCartMutation.mutate(product.id)}
                      disabled={addToCartMutation.isPending && addedProductId === product.id}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        addedProductId === product.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#008060] hover:bg-[#006E52] text-white shadow-xs'
                      }`}
                    >
                      {addedProductId === product.id ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 7. Value Perks Ribbon (Trust & Guarantees) ──────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        {[
          {
            icon: Truck,
            title: 'Free Delivery $50+',
            desc: 'Expedited 24-hr nationwide dispatch',
            color: 'text-[#008060] bg-[#F0F7F5]'
          },
          {
            icon: Banknote,
            title: 'Cash on Delivery',
            desc: 'Pay safely at your doorstep',
            color: 'text-emerald-700 bg-emerald-50'
          },
          {
            icon: ShieldCheck,
            title: '100% Quality Inspected',
            desc: 'Direct from authorized brands',
            color: 'text-amber-800 bg-amber-50'
          },
          {
            icon: RotateCcw,
            title: '30-Day Easy Returns',
            desc: 'Instant replacement & support',
            color: 'text-stone-800 bg-stone-100'
          }
        ].map((perk, i) => {
          const Icon = perk.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white border border-[#E1E3E5] shadow-xs flex items-center gap-3.5"
            >
              <div className={`p-2.5 rounded-xl ${perk.color} shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#1A1A1A]">{perk.title}</h4>
                <p className="text-[11px] text-gray-500">{perk.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 8. Newsletter Subscription Banner ───────────────────────────── */}
      <section className="rounded-3xl bg-[#111213] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl border border-gray-800">
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-[#008060]/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold">
            <Zap className="h-3.5 w-3.5" />
            <span>Exclusive VIP Shopping Access</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Subscribe & Get 15% Off Your First Order
          </h2>

          <p className="text-xs sm:text-sm text-gray-400">
            Join 50,000+ smart shoppers. Receive weekly curated deals, new product drop alerts, and exclusive subscriber promotions.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-[#008060]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#008060] hover:bg-[#006E52] text-white font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-md"
            >
              <span>Subscribe</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

          {newsletterSubscribed && (
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 pt-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Thank you for subscribing! Your 15% promo code has been sent.</span>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
