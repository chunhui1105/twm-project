import { Layout } from "@/components/layout";
import { useGetProduct, useGetProductReviews, useCreateProductReview, getGetProductReviewsQueryKey, Variation } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Star, Truck, Zap, AlertCircle, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductDetail() {
  const [, params] = useRoute("/shop/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: product, isLoading } = useGetProduct(id, { query: { enabled: !!id } });
  const { data: reviews, isLoading: loadingReviews } = useGetProductReviews(id, { query: { enabled: !!id } });
  
  const [selectedMedia, setSelectedMedia] = useState<number | "video">(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addReviewMutation = useCreateProductReview();
  const [reviewForm, setReviewForm] = useState({ reviewerName: "", rating: 5, title: "", comment: "" });

  useEffect(() => {
    if (product?.videoUrl) {
      setSelectedMedia("video");
    }
  }, [product?.videoUrl]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
          <Skeleton className="w-full md:w-1/2 aspect-square bg-secondary" />
          <div className="w-full md:w-1/2 space-y-6">
            <Skeleton className="h-10 w-3/4 bg-secondary" />
            <Skeleton className="h-32 w-full bg-secondary" />
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
          <p className="text-muted-foreground">The product you are looking for does not exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : (product.imageUrl ? [product.imageUrl] : []);

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
            <div className="aspect-square bg-secondary border border-border overflow-hidden relative">
              {selectedMedia === "video" && product.videoUrl ? (
                <video
                  src={product.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                />
              ) : images.length > 0 ? (
                <img 
                  src={images[selectedMedia as number]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
              )}
            </div>

            {(product.videoUrl || images.length > 1) && (
              <div className="grid grid-cols-4 gap-2">
                {product.videoUrl && (
                  <button
                    onClick={() => setSelectedMedia("video")}
                    className={`aspect-square bg-black border overflow-hidden relative flex items-center justify-center ${selectedMedia === "video" ? 'border-primary' : 'border-border opacity-60 hover:opacity-100'}`}
                  >
                    <video src={product.videoUrl} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </button>
                )}
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedMedia(idx)}
                    className={`aspect-square bg-secondary border overflow-hidden ${selectedMedia === idx ? 'border-primary' : 'border-border opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
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

            {reviews && reviews.length > 0 && (
              <div className="flex items-center gap-1 text-sm bg-secondary px-3 py-1.5 w-fit mb-6">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-bold">{product.rating?.toFixed(1) || "5.0"}</span>
                <span className="text-muted-foreground font-mono">({product.reviewCount} reviews)</span>
              </div>
            )}

            <p className="text-muted-foreground text-lg mb-8 max-w-xl leading-relaxed">
              {product.description || "High performance automotive component engineered for durability and exact fitment."}
            </p>

            {product.variations && (product.variations as Variation[]).length > 0 && (
              <div className="space-y-5 mb-8">
                {(product.variations as Variation[]).map((variation) => (
                  <div key={variation.name}>
                    <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                      {variation.name}
                      {selectedOptions[variation.name] && (
                        <span className="ml-2 text-foreground font-bold">— {selectedOptions[variation.name]}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variation.options.map(option => {
                        const isSelected = selectedOptions[variation.name] === option;
                        return (
                          <button
                            key={option}
                            onClick={() => setSelectedOptions(prev => ({
                              ...prev,
                              [variation.name]: isSelected ? "" : option
                            }))}
                            className={`px-4 py-2 text-sm font-mono border transition-all ${
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background hover:border-primary text-foreground"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm border-y border-border py-6">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <span>Quick Installation</span>
              </div>
              {product.brand && (
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <span>Brand: {product.brand}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-card py-20 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tighter mb-12 uppercase">Reviews</h2>
          
          <div className="space-y-8 mb-16">
            {loadingReviews ? (
              <Skeleton className="h-32 w-full bg-secondary" />
            ) : reviews?.length === 0 ? (
              <p className="text-muted-foreground italic">No reviews yet. Be the first.</p>
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
            <h3 className="text-xl font-bold uppercase tracking-wider mb-6">Leave a Review</h3>
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
                    <option value={5}>5 Stars — Excellent</option>
                    <option value={4}>4 Stars — Good</option>
                    <option value={3}>3 Stars — Average</option>
                    <option value={2}>2 Stars — Poor</option>
                    <option value={1}>1 Star — Bad</option>
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
                {addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
