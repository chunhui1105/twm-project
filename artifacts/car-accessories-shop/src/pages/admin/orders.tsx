import { AdminLayout } from "@/components/admin-layout";
import { useGetOrders, useUpdateOrderStatus, getGetOrdersQueryKey } from "@workspace/api-client-react";
import { Loader2, PackageSearch } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const { data: orders, isLoading } = useGetOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatusMutation.mutate({ id, data: { status: newStatus } }, {
      onSuccess: () => {
        toast({ title: `Order #${id} status updated to ${newStatus}` });
        queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
      }
    });
  };

  const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'processing': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'shipped': 'bg-primary/10 text-primary border-primary/20',
    'delivered': 'bg-green-500/10 text-green-500 border-green-500/20',
    'cancelled': 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tighter uppercase mb-1">Transmission Log</h1>
        <p className="text-muted-foreground text-sm">Monitor and process incoming orders.</p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border border-dashed">
            <PackageSearch className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-mono uppercase tracking-widest text-muted-foreground">No Transmissions Found</h3>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-card border border-border overflow-hidden">
              <div className="bg-secondary/30 p-4 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-lg font-bold text-primary">#{order.id}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 border ${statusColors[order.status] || 'bg-secondary text-foreground'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Set Status:</span>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updateStatusMutation.isPending}
                    className="bg-background border border-border py-1.5 px-3 text-sm font-mono uppercase focus:outline-none focus:border-primary disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4 border-b border-border pb-2">Manifest</h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div>
                          <span className="font-mono text-muted-foreground mr-3">{item.quantity}x</span>
                          <span className="font-bold">{item.productName}</span>
                        </div>
                        <span className="font-mono text-primary">${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-end mt-6 pt-4 border-t border-border">
                    <span className="font-bold uppercase tracking-wider">Total Value</span>
                    <span className="text-xl font-mono font-bold text-primary">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-2">Client Identity</h4>
                    <div className="text-sm space-y-1">
                      <div className="font-bold">{order.customerName}</div>
                      <div className="font-mono text-muted-foreground">{order.customerEmail}</div>
                      {order.customerPhone && <div className="font-mono text-muted-foreground">{order.customerPhone}</div>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-2">Destination Coordinates</h4>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {order.shippingAddress}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
