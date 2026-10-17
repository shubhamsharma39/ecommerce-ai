import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { productsApi, cartApi } from '@/api/services';
import { formatCurrency } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  Truck, 
  RotateCcw,
  Star,
  Banknote,
  Check,
  Zap,
  ShieldCheck,
  Package
} from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';

export const ProductDetailPage: React.FC<{ onCartUpdated?: () => void }> = ({ onCartUpdated }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Missing ID');
      return productsApi.getProductById(id);
    },
    enabled: !!id
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts()
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!product) return null;
      if (!isAuthenticated) {
        setShowAuthModal(true);
        return null;
      }
      return cartApi.addItem(product.id, quantity);
    },
    onSuccess: (data) => {
      if (!data) return;
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
      if (onCartUpdated) onCartUpdated();
    }
  });

  const buyNowMutation = useMutation({
    mutationFn: async () => {
      if (!product) return null;
      if (!isAuthenticated) {
        setShowAuthModal(true);
        return null;
      }
      await cartApi.addItem(product.id, quantity);
      return true;
    },
    onSuccess: (data) => {
      if (!data) return;
      if (onCartUpdated) onCartUpdated();
      navigate('/checkout');
    }
  });

  // Related products from same category
  const relatedProducts = allProducts
    .filter((p: any) => p.id !== id && p.category?.toLowerCase() === product?.category?.toLowerCase())
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-16 text-center text-gray-500">
        <div className="h-8 w-8 border-3 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Loading product details...</span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white border border-[#E1E3E5] rounded-3xl space-y-4 shadow-xs">
        <Package className="h-12 w-12 text-gray-400 mx-auto" />
        <h2 className="text-xl font-black text-[#1A1A1A]">Product Not Found</h2>
        <p className="text-xs text-gray-500">The product you requested could not be located in our store catalog.</p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#008060] font-bold text-xs text-white hover:bg-[#006E52] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Store Catalog</span>
        </Link>
      </div>
    );
  }

  const stockAvailable = product.stock || 15;
  const originalPrice = Math.round(product.price * 1.25);
  const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 font-bold text-[#1A1A1A] hover:text-[#008060] hover:border-[#008060] transition shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <span className="text-gray-500">
            <Link to="/" className="hover:text-[#008060]">Home</Link> / <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#008060]">{product.category}</Link> / <span className="text-[#1A1A1A] font-bold">{product.name}</span>
          </span>
        </div>

        {/* Main Product Showcase Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 rounded-3xl bg-white border border-[#E1E3E5] p-6 sm:p-10 shadow-xs">
          
          {/* Left: Product Image Column */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-gray-50 border border-gray-100 p-6 overflow-hidden group flex items-center justify-center">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#008060] text-white text-xs font-extrabold shadow-xs">
                {discountPct}% OFF
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center gap-1 text-[11px] text-gray-600">
                <Truck className="h-4 w-4 text-[#008060]" />
                <span className="font-bold text-[#1A1A1A]">Free Shipping</span>
                <span className="text-[10px] text-gray-400">On orders $50+</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center gap-1 text-[11px] text-gray-600">
                <Banknote className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-[#1A1A1A]">Cash on Delivery</span>
                <span className="text-[10px] text-gray-400">Doorstep pay</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center gap-1 text-[11px] text-gray-600">
                <RotateCcw className="h-4 w-4 text-amber-600" />
                <span className="font-bold text-[#1A1A1A]">30-Day Returns</span>
                <span className="text-[10px] text-gray-400">Hassle-free</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#008060] uppercase tracking-wider bg-[#F0F7F5] px-2.5 py-1 rounded-lg">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex items-center text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400" />
                  </div>
                  <span className="font-bold text-[#1A1A1A]">{product.rating || 4.8}</span>
                  <span className="text-gray-400">({product.reviewCount || 118} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] leading-tight">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#008060]">
                    {formatCurrency(product.price, product.currency || 'USD')}
                  </span>
                  <span className="text-base text-gray-400 line-through">
                    {formatCurrency(originalPrice, 'USD')}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save {formatCurrency(originalPrice - product.price, 'USD')}
                  </span>
                </div>

                <div className="pt-1">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stockAvailable > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700'}`}>
                    {stockAvailable > 0 ? `In Stock (${stockAvailable} units available)` : 'Currently Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
                {product.description}
              </p>

              {/* Specifications Table */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-2 text-xs">
                <div className="font-bold text-[#1A1A1A] pb-1 border-b border-gray-200">Product Specifications</div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div><strong>Category:</strong> {product.category}</div>
                  <div><strong>Availability:</strong> {stockAvailable > 0 ? 'Ready to Dispatch' : 'Out of Stock'}</div>
                  <div><strong>Warranty:</strong> 1-Year Comprehensive</div>
                  <div><strong>Payment:</strong> Cash on Delivery / Card</div>
                </div>
              </div>
            </div>

            {/* Action Zone: Quantity, Add to Cart & Buy Now */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              
              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A]">Quantity</span>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-[#1A1A1A] hover:bg-gray-100 disabled:opacity-30 transition font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-black text-[#1A1A1A]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stockAvailable, q + 1))}
                    disabled={quantity >= stockAvailable}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-[#1A1A1A] hover:bg-gray-100 disabled:opacity-30 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart and Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => addToCartMutation.mutate()}
                  disabled={stockAvailable <= 0 || addToCartMutation.isPending}
                  className={`py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition ${
                    added
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-[#F0F7F5] hover:bg-[#E0EFEA] text-[#008060] border-[#CBE2DA]'
                  }`}
                >
                  {added ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Added {quantity} to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => buyNowMutation.mutate()}
                  disabled={stockAvailable <= 0 || buyNowMutation.isPending}
                  className="py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-[#008060] hover:bg-[#006E52] text-white shadow-md shadow-[#008060]/20 flex items-center justify-center gap-2 transition"
                >
                  <Zap className="h-4 w-4 text-amber-300" />
                  <span>Buy Now ({formatCurrency(product.price * quantity, 'USD')})</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <section className="space-y-4 pt-4">
            <h2 className="text-xl font-black text-[#1A1A1A] section-heading-underline">
              Related Products in <span className="text-[#008060]">{product.category}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p: any) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="product-card p-3.5 flex flex-col justify-between bg-white"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 p-2 flex items-center justify-center">
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-contain mix-blend-multiply" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A] line-clamp-1">{p.name}</h4>
                    <p className="text-xs font-black text-[#008060] mt-1">{formatCurrency(p.price, 'USD')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
