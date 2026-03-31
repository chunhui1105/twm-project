import { AdminLayout } from "@/components/admin-layout";
import { useGetProduct, useCreateProduct, useUpdateProduct, useGetCategories, getGetProductsQueryKey, getGetProductQueryKey } from "@workspace/api-client-react";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function AdminProductForm() {
  const [match, params] = useRoute("/admin/products/:id/edit");
  const isEdit = match && params?.id !== "new";
  const productId = isEdit ? parseInt(params.id) : 0;

  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: product, isLoading: loadingProduct } = useGetProduct(productId, { 
    query: { enabled: isEdit } 
  });
  const { data: categories } = useGetCategories();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    imageUrl: "",
    categoryId: 0,
    brand: "",
    sku: "",
    stock: 0,
    featured: false,
    tags: [] as string[]
  });

  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (isEdit && product) {
      setForm({
        name: product.name,
        description: product.description || "",
        price: product.price,
        compareAtPrice: product.compareAtPrice || 0,
        imageUrl: product.imageUrl || "",
        categoryId: product.categoryId || 0,
        brand: product.brand || "",
        sku: product.sku || "",
        stock: product.stock,
        featured: product.featured,
        tags: product.tags || []
      });
      setTagsInput((product.tags || []).join(", "));
    }
  }, [isEdit, product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...form,
      categoryId: form.categoryId || null,
      compareAtPrice: form.compareAtPrice || null,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean)
    };

    if (isEdit) {
      updateMutation.mutate({ id: productId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Gear updated successfully" });
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetProductQueryKey(productId) });
          setLocation("/admin/products");
        }
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "New gear added successfully" });
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
          setLocation("/admin/products");
        }
      });
    }
  };

  if (isEdit && loadingProduct) return <AdminLayout><div className="p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tighter uppercase mb-8 pb-4 border-b border-border">
          {isEdit ? 'Modify Gear Specs' : 'Register New Gear'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Product Name *</label>
              <input 
                required type="text" 
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Base Price ($) *</label>
              <input 
                required type="number" step="0.01" min="0"
                value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary font-mono" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Compare At Price ($)</label>
              <input 
                type="number" step="0.01" min="0"
                value={form.compareAtPrice} onChange={e => setForm({...form, compareAtPrice: parseFloat(e.target.value)})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary font-mono" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Description</label>
              <textarea 
                rows={4}
                value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary resize-none" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Primary Image URL</label>
              <input 
                type="url" 
                value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary font-mono text-sm" 
              />
              {form.imageUrl && (
                <div className="mt-2 w-24 h-24 border border-border bg-background">
                  <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover mix-blend-luminosity" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Category</label>
              <select
                value={form.categoryId} onChange={e => setForm({...form, categoryId: parseInt(e.target.value)})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary"
              >
                <option value={0}>Select Category...</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Brand</label>
              <input 
                type="text" 
                value={form.brand} onChange={e => setForm({...form, brand: e.target.value})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">SKU / Part Number</label>
              <input 
                type="text" 
                value={form.sku} onChange={e => setForm({...form, sku: e.target.value})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary font-mono" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Inventory Stock *</label>
              <input 
                required type="number" min="0"
                value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value)})}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary font-mono" 
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Tags (comma separated)</label>
              <input 
                type="text" 
                value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary font-mono text-sm" 
                placeholder="exterior, carbon, performance..."
              />
            </div>

            <div className="space-y-2 md:col-span-2 flex items-center gap-3 pt-4 border-t border-border">
              <input 
                type="checkbox" 
                id="featured"
                checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})}
                className="w-5 h-5 accent-primary bg-background border-border" 
              />
              <label htmlFor="featured" className="font-bold uppercase tracking-wider cursor-pointer">Featured Product</label>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-4">
            <Link 
              href="/admin/products"
              className="px-6 py-3 font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-primary text-primary-foreground font-bold uppercase tracking-widest px-8 py-3 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? "Processing..." : isEdit ? "Commit Changes" : "Deploy Gear"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
