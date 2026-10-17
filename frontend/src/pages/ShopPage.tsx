import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { productsApi, cartApi } from '@/api/services';
import { formatCurrency } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Star, 
  Search, 
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Filter
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

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Apple iPhone 15 Pro Max (256GB)',
    description: 'Forged in titanium with A17 Pro chip, 48MP camera system, and USB-C connectivity.',
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
    description: 'Galaxy AI smartphone with 200MP camera, built-in S-Pen, and titanium frame.',
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
    description: 'Industry-leading noise cancellation with 30hr battery and spatial audio.',
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
    description: 'Strikingly thin design with Apple M3 chip, Liquid Retina display, and 18-hour battery.',
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
    description: 'Premium Italian wool blend blazer with slim silhouette and satin lining.',
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
    description: 'Handcrafted stoneware dripper with heat-resistant borosilicate glass server.',
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
    description: 'Heavy-duty enameled cast iron Dutch oven providing flawless heat retention.',
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
    description: 'Infused with hyaluronic acid, green tea extract, and vitamin C for radiant skin.',
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
    description: 'Undated 12-month goal setting and daily habit tracker bound in vegan leather.',
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
    description: 'Precision heart rate, blood oxygen, and workout GPS telemetry with a 14-day battery.',
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
    description: 'Ergonomic 24L backpack with padded 16-inch laptop pocket and USB pass-through.',
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

const TARGET_CATEGORIES = [
  'All',
  'Mobiles',
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Books & Stationery',
  'Sports & Fitness',
  'Accessories'
];

export const ShopPage: React.FC<{ searchQuery?: string; onCartUpdated?: () => void }> = ({ onCartUpdated }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category') || 'All';
  const urlSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [search, setSearch] = useState<string>(urlSearch);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Sync state with URL params
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category')!);
    }
    if (searchParams.get('search') !== null) {
      setSearch(searchParams.get('search') || '');
    }
  }, [searchParams]);

  const { data: serverProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts(),
    retry: 1
  });

  const allProducts = serverProducts.length > 0 ? serverProducts : DEFAULT_PRODUCTS;

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Category
        if (selectedCategory !== 'All') {
          const matchCat = p.category?.toLowerCase() === selectedCategory.toLowerCase();
          const looseMatch = p.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                             selectedCategory.toLowerCase().includes(p.category?.toLowerCase() || '');
          if (!matchCat && !looseMatch) return false;
        }

        // Price Range
        if (p.price < minPrice || p.price > maxPrice) {
          return false;
        }

        // Search Term
        const query = search.trim().toLowerCase();
        if (query) {
          const inName = p.name?.toLowerCase().includes(query);
          const inDesc = p.description?.toLowerCase().includes(query);
          const inBrand = p.brand?.toLowerCase().includes(query);
          const inCat = p.category?.toLowerCase().includes(query);
          if (!inName && !inDesc && !inBrand && !inCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // Natural/featured
      });
  }, [allProducts, selectedCategory, minPrice, maxPrice, search, sortBy]);

  const displayedList = filteredProducts.slice(0, visibleCount);

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

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearch('');
    setMinPrice(0);
    setMaxPrice(1500);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white border border-[#E1E3E5] p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F7F5] text-[#008060] text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Online Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
            Explore All Products
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Browse our wide selection of mobiles, electronics, fashion, home decor, and daily lifestyle essentials with guaranteed Cash on Delivery.
          </p>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white border border-[#E1E3E5] p-5 space-y-6 shadow-xs sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#008060]" />
                Filter Products
              </span>
              {(selectedCategory !== 'All' || search || maxPrice < 1500 || minPrice > 0) && (
                <button
                  onClick={handleClearFilters}
                  className="text-[11px] text-[#008060] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A1A1A]">Search by Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="E.g. iPhone, Sony, Hoodie..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F8F9FA] border border-gray-200 rounded-xl text-xs text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#008060] transition"
                />
              </div>
            </div>

            {/* Categories Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A1A1A]">Category</label>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {TARGET_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                        isSelected
                          ? 'bg-[#008060] text-white shadow-xs font-bold'
                          : 'text-[#424242] hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#1A1A1A]">Price Range</span>
                <span className="font-extrabold text-[#008060]">${minPrice} - ${maxPrice}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1500"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#008060] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>$0</span>
                <span>$1,500</span>
              </div>
            </div>

          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Bar: Count & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E1E3E5] px-5 py-3 rounded-2xl shadow-xs">
            <span className="text-xs font-bold text-gray-500">
              Showing <span className="text-[#1A1A1A] font-black">{filteredProducts.length}</span> results {selectedCategory !== 'All' && <span>in <strong className="text-[#008060]">{selectedCategory}</strong></span>}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F8F9FA] border border-gray-200 text-xs font-bold text-[#1A1A1A] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#008060] cursor-pointer"
              >
                <option value="featured">Featured Deals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E1E3E5] rounded-3xl space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-black text-[#1A1A1A]">No Matching Products Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                We could not find any items matching your selected criteria. Try resetting your filters or adjusting your price slider.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-[#008060] text-white font-bold text-xs hover:bg-[#006E52] transition shadow-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {displayedList.map((product) => {
                  const originalPrice = product.originalPrice || Math.round(product.price * 1.25);
                  const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);

                  return (
                    <div
                      key={product.id}
                      className="product-card flex flex-col justify-between p-4 bg-white relative group"
                    >
                      {/* Discount Badge */}
                      <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-[#008060] text-white font-extrabold text-[10px] shadow-xs">
                        {discountPct}% OFF
                      </div>

                      {/* Stock Badge */}
                      <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md bg-white/90 text-gray-600 font-bold text-[9px] border border-gray-200">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </div>

                      {/* Product Image */}
                      <Link to={`/products/${product.id}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-gray-50 p-3 mt-4 mb-3 flex items-center justify-center">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                          loading="lazy"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="space-y-1.5 text-left">
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
                        <div className="flex items-center gap-1 text-amber-500 text-xs">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-[#1A1A1A] text-[11px]">{product.rating || 4.8}</span>
                          <span className="text-gray-400 text-[10px]">({product.reviewCount || 108})</span>
                        </div>

                        {/* Price */}
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

                      {/* Action Buttons */}
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

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-6 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-[#008060] text-[#1A1A1A] font-bold text-xs transition shadow-xs"
                  >
                    Load More Products ({filteredProducts.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>

    </div>
  );
};
