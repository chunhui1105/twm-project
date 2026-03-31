import { AdminLayout } from "@/components/admin-layout";
import { useGetProducts, useDeleteProduct, getGetProductsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useGetProducts({ search: debouncedSearch || undefined, limit: 50 });
  const deleteMutation = useDeleteProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (!confirm("Confirm deletion of this gear?")) return;
    
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Gear deleted", variant: "destructive" });
        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      }
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase mb-1">Inventory Management</h1>
          <p className="text-muted-foreground text-sm">Control catalog items and stock levels.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Gear
        </Link>
      </div>

      <div className="bg-card border border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search ID, name, SKU..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-background border border-border py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 font-mono text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4">ID / SKU</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : data?.products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-mono">
                    No records found
                  </td>
                </tr>
              ) : (
                data?.products.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      #{product.id} <br/> {product.sku && <span className="text-[10px]">{product.sku}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-background border border-border overflow-hidden hidden sm:block">
                          {product.imageUrl && <img src={product.imageUrl} alt="" className="w-full h-full object-cover mix-blend-luminosity" />}
                        </div>
                        <div>
                          <div className="font-bold">{product.name}</div>
                          <div className="text-xs text-muted-foreground uppercase">{product.categoryName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-primary font-bold">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center font-mono">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock > 0 ? (
                        <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider border border-green-500/20">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-wider border border-destructive/20">Empty</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-muted-foreground hover:text-primary transition-colors bg-background border border-border"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-background border border-border disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
