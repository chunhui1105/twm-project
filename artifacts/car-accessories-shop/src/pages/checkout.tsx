import { Layout } from "@/components/layout";
import { useGetCart, useCreateOrder, getGetCartQueryKey } from "@workspace/api-client-react";
import { getCartSessionId } from "@/lib/cart-session";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Checkout() {
  const sessionId = getCartSessionId();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: cart, isLoading: cartLoading } = useGetCart(
    { sessionId },
    { query: { enabled: !!sessionId, queryKey: getGetCartQueryKey({ sessionId }) } }
  );

  const createOrder = useCreateOrder();

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
  });

  const [orderComplete, setOrderComplete] = useState<{id: number, total: number} | null>(null);

  useEffect(() => {
    if (!cartLoading && (!cart || cart.itemCount === 0) && !orderComplete) {
      setLocation("/shop");
    }
  }, [cart, cartLoading, setLocation, orderComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate({
      data: {
        sessionId,
        ...form
      }
    }, {
      onSuccess: (order) => {
        // Regenerate session id so cart is cleared
        localStorage.setItem('cartSessionId', crypto.randomUUID());
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
        setOrderComplete({ id: order.id, total: order.total });
      }
    });
  };

  if (orderComplete) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase mb-4">Order Confirmed</h1>
          <p className="text-muted-foreground text-lg mb-2">
            Your transmission has been received. Transmission ID: <span className="font-mono text-primary font-bold">#{orderComplete.id}</span>
          </p>
          <p className="text-muted-foreground mb-8">
            Total charged: <span className="font-mono">${orderComplete.total.toFixed(2)}</span>
          </p>
          
          <button 
            onClick={() => setLocation("/shop")}
            className="bg-foreground text-background font-bold uppercase tracking-widest px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-colors inline-flex items-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Layout>
    );
  }

  if (cartLoading || !cart) return <Layout><div className="p-24 text-center"><Loader2 className="animate-spin mx-auto w-8 h-8 text-primary" /></div></Layout>;

  return (
    <Layout>
      <div className="bg-card border-b border-border py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Secure Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b border-border">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Full Name *</label>
                  <input 
                    required type="text" 
                    value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})}
                    className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email Address *</label>
                  <input 
                    required type="email" 
                    value={form.customerEmail} onChange={e => setForm({...form, customerEmail: e.target.value})}
                    className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary font-mono" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Phone Number</label>
                  <input 
                    type="tel" 
                    value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})}
                    className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary font-mono" 
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b border-border">Shipping Destination</h2>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Full Address *</label>
                <textarea 
                  required rows={3}
                  value={form.shippingAddress} onChange={e => setForm({...form, shippingAddress: e.target.value})}
                  className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary resize-none font-mono" 
                  placeholder="Street, City, State/Province, ZIP/Postal Code, Country"
                />
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={createOrder.isPending}
                className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-widest py-4 hover:bg-primary/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {createOrder.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Order"}
              </button>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-card border border-border p-6 sticky top-24">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 pb-4 border-b border-border">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cart.items.map(item => (
                <div key={item.productId} className="flex gap-4 items-start">
                  <div className="w-16 h-16 bg-background border border-border flex-shrink-0">
                    {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover mix-blend-luminosity" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate">{item.productName}</h4>
                    <div className="text-xs text-muted-foreground font-mono mt-1">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-mono text-primary font-bold">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 font-mono space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-primary uppercase text-xs">Free</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-border mt-4">
                <span className="font-sans font-bold uppercase tracking-wider text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
