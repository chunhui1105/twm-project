import { AdminLayout } from "@/components/admin-layout";
import { useGetProducts, useDeleteProduct, useUpdateProduct, getGetProductsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Search, Loader2, Star } from "lucide-react";
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
  const updateMutation = useUpdateProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (!confirm("Confirm deletion of this product?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Product deleted", variant: "destructive" });
        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      }
    });
  };

  const handleToggleFeatured = (id: number, current: boolean) => {
    updateMutation.mutate(
      { id, data: { featured: !current } },
      {
        onSuccess: () => {
          toast({ title: current ? "Removed from Featured Gear" : "Added to Featured Gear" });
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
        },
        onError: () => toast({ title: "Failed to update", variant: "destructive" }),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase mb-1">Products</h1>
          <p className="text-muted-foreground text-sm">
            Click the <Star className="inline w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> star to feature a product on the homepage.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-card border border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, SKU..."
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
                <th className="px-4 py-4 text-center w-12">Featured</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : data?.products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-mono">
                    No products found
                  </td>
                </tr>
              ) : (
                data?.products.map((product) => (
                  <tr key={product.id} className={`hover:bg-secondary/20 transition-colors ${product.featured ? "bg-yellow-50/40" : ""}`}>
                    {/* Featured star toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product.id, product.featured)}
                        disabled={updateMutation.isPending}
                        title={product.featured ? "Remove from Featured Gear" : "Add to Featured Gear"}
                        className="transition-transform hover:scale-110 disabled:opacity-40"
                      >
                        <Star
                          className={`w-5 h-5 ${product.featured ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      </button>
                    </td>

                    {/* Product name + image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-background border border-border overflow-hidden flex-shrink-0 hidden sm:block">
                          {product.imageUrl && <img src={product.imageUrl} alt="" className="w-full h-full object-cover mix-blend-luminosity" />}
                        </div>
                        <div>
                          <div className="font-bold">{product.name}</div>
                          {product.sku && <div className="text-xs text-muted-foreground font-mono">{product.sku}</div>}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground text-xs uppercase tracking-wide">
                      {product.categoryName || "—"}
                    </td>

                    <td className="px-6 py-4 text-center font-mono">
                      {product.stock > 0 ? (
                        <span className="text-green-600 font-bold">{product.stock}</span>
                      ) : (
                        <span className="text-destructive font-bold">0</span>
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

        {/* Legend */}
        <div className="px-6 py-3 border-t border-border bg-secondary/20 text-xs text-muted-foreground font-mono flex items-center gap-2">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          Starred products appear in the <strong>Featured Gear</strong> section on the homepage.
        </div>
      </div>
    </AdminLayout>
  );
}
