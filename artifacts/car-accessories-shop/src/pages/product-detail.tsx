import { Layout } from "@/components/layout";
import { useGetProduct, useGetProductReviews, useCreateProductReview, useAddToCart, getGetCartQueryKey, getGetProductReviewsQueryKey } from "@workspace/api-client-react";
import { useRoute, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Star, Shield, Truck, Zap, ShoppingCart, Minus, Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCartSessionId } from "@/lib/cart-session";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const [, params] = useRoute("/shop/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: product, isLoading } = useGetProduct(id, { query: { enabled: !!id } });
  const { data: reviews, isLoading: loadingReviews } = useGetProductReviews(id, { query: { enabled: !!id } });
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const sessionId = getCartSessionId();

  const addToCartMutation = useAddToCart();
  const addReviewMutation = useCreateProductReview();

  const [reviewForm, setReviewForm] = useState({ reviewerName: "", rating: 5, title: "", comment: "" });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
          <Skeleton className="w-full md:w-1/2 aspect-square bg-secondary" />
          <div className="w-full md:w-1/2 space-y-6">
            <Skeleton className="h-10 w-3/4 bg-secondary" />
            <Skeleton className="h-6 w-1/4 bg-secondary" />
            <Skeleton className="h-32 w-full bg-secondary" />
            <Skeleton className="h-12 w-1/3 bg-secondary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold tracking-tighter mb-2">Product Not Found</h2>
          <p className="text-muted-foreground">The gear you are looking for does not exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : (product.imageUrl ? [product.imageUrl] : []);

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      data: {
        sessionId,
        productId: product.id,
        quantity
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Added to Cart",
          description: `${quantity}x ${product.name} added to your cart.`,
        });
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
      }
    });
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    addReviewMutation.mutate({
      id: product.id,
      data: reviewForm
    }, {
      onSuccess: () => {
        toast({ title: "Review submitted", description: "Thanks for your feedback!" });
        setReviewForm({ reviewerName: "", rating: 5, title: "", comment: "" });
        queryClient.invalidateQueries({ queryKey: getGetProductReviewsQueryKey(product.id) });
      }
    });
  };

  return (
    <Layout>
      {/* Product Top */}
      <div className="bg-background border-b border-border py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Gallery */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="aspect-square bg-secondary border border-border overflow-hidden relative group">
              {images.length > 0 ? (
                <img 
                  src={images[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-secondary border overflow-hidden ${selectedImage === idx ? 'border-primary' : 'border-border opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover mix-blend-luminosity" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="text-sm text-primary font-mono tracking-widest uppercase mb-2">
              {product.brand && `${product.brand} // `}{product.categoryName || "GEAR"}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 leading-tight uppercase">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-mono font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through font-mono mb-1">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm bg-secondary px-2 py-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-bold">{product.rating?.toFixed(1) || "5.0"}</span>
                <span className="text-muted-foreground font-mono">({product.reviewCount})</span>
              </div>
            </div>

            <p className="text-muted-foreground text-lg mb-8 max-w-xl leading-relaxed">
              {product.description || "High performance automotive component engineered for durability and exact fitment."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-sm border-y border-border py-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span>Lifetime Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <span>Quick Installation</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-primary" />
                <span>Stock: {product.stock > 0 ? <span className="text-foreground font-mono">{product.stock} units</span> : <span className="text-destructive font-bold uppercase">Out of Stock</span>}</span>
              </div>
            </div>

            {product.stock > 0 ? (
              <div className="flex flex-col gap-4 mt-auto">
                <div className="flex gap-4">
                  <div className="flex items-center border border-border bg-card">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-4 py-3 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-mono font-bold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="px-4 py-3 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    className="flex-1 bg-primary text-primary-foreground font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {addToCartMutation.isPending ? "Adding..." : (
                      <>
                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-destructive/10 text-destructive border border-destructive/20 px-6 py-4 text-center font-bold tracking-widest uppercase">
                Currently Unavailable
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-card py-20 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tighter mb-12 uppercase">Field Reports</h2>
          
          <div className="space-y-8 mb-16">
            {loadingReviews ? (
              <Skeleton className="h-32 w-full bg-secondary" />
            ) : reviews?.length === 0 ? (
              <p className="text-muted-foreground italic">No reports filed for this item yet. Be the first.</p>
            ) : (
              reviews?.map(review => (
                <div key={review.id} className="border border-border p-6 bg-background">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{review.title || "Review"}</h4>
                      <div className="text-sm text-muted-foreground font-mono flex items-center gap-2 mt-1">
                        <span className="text-foreground">{review.reviewerName}</span>
                        <span>//</span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`} />
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
                </div>
              ))
            )}
          </div>

          <div className="border border-border p-8 bg-background">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-6">File a Report</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Name</label>
                  <input 
                    required
                    type="text" 
                    value={reviewForm.reviewerName}
                    onChange={e => setReviewForm({...reviewForm, reviewerName: e.target.value})}
                    className="w-full bg-secondary border border-border p-3 focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Rating</label>
                  <select 
                    value={reviewForm.rating}
                    onChange={e => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                    className="w-full bg-secondary border border-border p-3 focus:outline-none focus:border-primary"
                  >
                    <option value={5}>5 - Flawless</option>
                    <option value={4}>4 - Solid</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Subpar</option>
                    <option value={1}>1 - Defective</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Title (Optional)</label>
                <input 
                  type="text" 
                  value={reviewForm.title}
                  onChange={e => setReviewForm({...reviewForm, title: e.target.value})}
                  className="w-full bg-secondary border border-border p-3 focus:outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Comments</label>
                <textarea 
                  rows={4}
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                  className="w-full bg-secondary border border-border p-3 focus:outline-none focus:border-primary resize-none" 
                />
              </div>
              <button 
                type="submit"
                disabled={addReviewMutation.isPending}
                className="bg-foreground text-background font-bold uppercase tracking-widest px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
              >
                {addReviewMutation.isPending ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
