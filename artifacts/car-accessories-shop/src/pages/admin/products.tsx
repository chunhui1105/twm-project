import { AdminLayout } from "@/components/admin-layout";
import { useGetProducts, useDeleteProduct, useUpdateProduct, useGetCategories, getGetProductsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Search, Loader2, Star, Tag, Check, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function InlineCategoryEditor({
  productId,
  currentCategoryId,
  currentCategoryName,
  categories,
  onSave,
  isPending,
}: {
  productId: number;
  currentCategoryId: number | null;
  currentCategoryName: string | null;
  categories: { id: number; name: string }[];
  onSave: (productId: number, categoryId: number | null) => void;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(currentCategoryId ?? null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(currentCategoryId ?? null);
  }, [currentCategoryId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSave = () => {
    onSave(productId, selected);
    setOpen(false);
  };

  const handleCancel = () => {
    setSelected(currentCategoryId ?? null);
    setOpen(false);
  };

  const selectedName = selected
    ? categories.find(c => c.id === selected)?.name ?? "—"
    : "—";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        disabled={isPending}
        title="Click to change category"
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors group
          ${currentCategoryId
            ? "bg-primary/8 text-primary border border-primary/20 hover:border-primary/50"
            : "text-muted-foreground border border-dashed border-border hover:border-primary/40 hover:text-primary"
          }`}
      >
        <Tag className="w-3 h-3 flex-shrink-0" />
        <span className="uppercase tracking-wide font-medium">
          {currentCategoryName ?? "Unassigned"}
        </span>
        {isPending && <Loader2 className="w-3 h-3 animate-spin ml-0.5" />}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-56 bg-card border border-border shadow-lg rounded overflow-hidden">
          <div className="p-1.5 border-b border-border bg-secondary/30">
            <p className="text-xs text-muted-foreground font-mono px-1">Assign category</p>
          </div>
          <div className="max-h-52 overflow-y-auto">
            <button
              onClick={() => setSelected(null)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors flex items-center justify-between
                ${selected === null ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              <span className="italic">Unassigned</span>
              {selected === null && <Check className="w-3.5 h-3.5" />}
            </button>
            {categories.filter(c => c.name !== "Find By Car Model").map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors flex items-center justify-between
                  ${selected === cat.id ? "text-primary font-medium bg-primary/5" : "text-foreground"}`}
              >
                <span>{cat.name}</span>
                {selected === cat.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 p-2 border-t border-border bg-secondary/20">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 font-medium"
            >
              <Check className="w-3 h-3" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border border-border rounded hover:bg-muted text-muted-foreground"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [updatingCategoryFor, setUpdatingCategoryFor] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useGetProducts({ search: debouncedSearch || undefined, limit: 50 });
  const { data: categories } = useGetCategories();
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

  const handleCategoryChange = (productId: number, categoryId: number | null) => {
    setUpdatingCategoryFor(productId);
    updateMutation.mutate(
      { id: productId, data: { categoryId: categoryId ?? undefined } },
      {
        onSuccess: () => {
          toast({ title: "Category updated" });
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
          setUpdatingCategoryFor(null);
        },
        onError: () => {
          toast({ title: "Failed to update category", variant: "destructive" });
          setUpdatingCategoryFor(null);
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase mb-1">Products</h1>
          <p className="text-muted-foreground text-sm">
            Click the <Star className="inline w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> star to feature on homepage.
            Click the <Tag className="inline w-3.5 h-3.5 text-primary" /> category badge to reassign.
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

                    {/* Inline category editor */}
                    <td className="px-6 py-4">
                      <InlineCategoryEditor
                        productId={product.id}
                        currentCategoryId={product.categoryId ?? null}
                        currentCategoryName={product.categoryName ?? null}
                        categories={categories ?? []}
                        onSave={handleCategoryChange}
                        isPending={updatingCategoryFor === product.id}
                      />
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
        <div className="px-6 py-3 border-t border-border bg-secondary/20 text-xs text-muted-foreground font-mono flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            Starred = shown in <strong>Featured Gear</strong> on homepage
          </span>
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-primary" />
            Click category badge to reassign instantly
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}
