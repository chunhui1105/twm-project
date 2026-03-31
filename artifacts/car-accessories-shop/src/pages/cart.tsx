import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { useGetCart, useUpdateCartItem, useRemoveFromCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { getCartSessionId } from "@/lib/cart-session";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Cart() {
  const sessionId = getCartSessionId();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useGetCart(
    { sessionId },
    { query: { enabled: !!sessionId, queryKey: getGetCartQueryKey({ sessionId }) } }
  );

  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    updateItem.mutate({ sessionId, productId, data: { quantity } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) })
    });
  };

  const handleRemove = (productId: number) => {
    removeItem.mutate({ sessionId, productId }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) })
    });
  };

  return (
    <Layout>
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tighter uppercase">Operations Cart</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full bg-secondary" />
            <Skeleton className="h-24 w-full bg-secondary" />
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border bg-card/50">
            <div className="text-muted-foreground mb-6 uppercase tracking-widest font-mono text-sm">Cart is empty</div>
            <Link href="/shop" className="bg-primary text-primary-foreground font-bold uppercase tracking-widest px-8 py-4 inline-block hover:bg-primary/90 transition-colors">
              Return to Catalog
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-2/3 space-y-6">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {cart.items.map((item) => (
                <div key={item.productId} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 border-b border-border border-dashed">
                  <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <Link href={`/shop/${item.productId}`}>
                      <div className="w-20 h-20 bg-secondary border border-border flex-shrink-0 cursor-pointer overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                        )}
                      </div>
                    </Link>
                    <div>
                      <Link href={`/shop/${item.productId}`}>
                        <h3 className="font-bold hover:text-primary transition-colors cursor-pointer leading-tight mb-1">{item.productName}</h3>
                      </Link>
                      <button 
                        onClick={() => handleRemove(item.productId)}
                        className="text-xs text-destructive hover:underline flex items-center gap-1 uppercase font-mono tracking-wider"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 text-center hidden md:block font-mono text-muted-foreground">
                    ${item.price.toFixed(2)}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex justify-center">
                    <div className="flex items-center border border-border bg-card">
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        disabled={updateItem.isPending}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        disabled={updateItem.isPending}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 text-right font-mono font-bold text-primary">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-1/3">
              <div className="bg-card border border-border p-8 sticky top-24">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-6 border-b border-border pb-4">Order Summary</h2>
                
                <div className="space-y-4 font-mono text-sm mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({cart.itemCount} items)</span>
                    <span className="text-foreground">${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-primary uppercase tracking-widest text-xs">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="uppercase tracking-wider font-bold">Total</span>
                    <span className="text-3xl font-mono font-bold text-primary">${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout"
                  className="w-full block text-center bg-primary text-primary-foreground font-bold uppercase tracking-widest py-4 hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout
                </Link>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Secure encrypted connection
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
